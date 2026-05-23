import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ExtensionAPI, ExtensionContext, ToolCallEvent, ToolResultEvent } from "@earendil-works/pi-coding-agent";
import { loadProjectConfig } from "./config.js";
import { contextMessage, loadConventions } from "./context.js";
import {
	baseProfiles,
	contextualProfilesForText,
	contextualProfilesForToolResult,
	isCodePath,
	pathFromToolInput,
	uniqueProfiles,
} from "./contextual-profiles.js";
import { detectProfiles, loadRegistry, type ProfileRegistry } from "./detection.js";
import { registerCodeSkillWorkflow } from "./skills/code.js";
import { loadWorkflowContext, promptHasAnySkill, promptHasSkill, workflowFilesForPrompt } from "./workflows.js";

function findPiCodeRepo(): string {
	const moduleDir = dirname(fileURLToPath(import.meta.url));
	const candidates = [resolve(moduleDir, "../.."), resolve(moduleDir, "..")];

	for (const candidate of candidates) {
		if (existsSync(join(candidate, "profiles", "registry.json")) && existsSync(join(candidate, "workflows"))) {
			return candidate;
		}
	}

	throw new Error(`pi-code package root not found from ${moduleDir}`);
}

function hashText(text: string): string {
	return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

export default function piCode(pi: ExtensionAPI) {
	const repoDir = findPiCodeRepo();
	const loadedRegistry = loadRegistry(repoDir);
	if (!loadedRegistry) {
		throw new Error(`pi-code profile registry could not be loaded from ${join(repoDir, "profiles", "registry.json")}`);
	}
	const registry: ProfileRegistry = loadedRegistry;

	registerCodeSkillWorkflow(pi, repoDir);

	const profileCache = new Map<string, string[]>();
	const activeContextualProfiles = new Map<string, Set<string>>();
	const injectedContextCache = new Map<string, Set<string>>();

	function shouldInject(cwd: string, key: string): boolean {
		const injected = injectedContextCache.get(cwd) ?? new Set<string>();
		if (injected.has(key)) return false;
		injected.add(key);
		injectedContextCache.set(cwd, injected);
		return true;
	}

	pi.on("session_compact", () => {
		injectedContextCache.clear();
	});

	function getDetectedProfiles(cwd: string): string[] {
		if (profileCache.has(cwd)) return profileCache.get(cwd)!;

		const config = loadProjectConfig(cwd);
		if (config?.profiles?.length) {
			profileCache.set(cwd, config.profiles);
			return config.profiles;
		}

		const detected = detectProfiles(cwd, registry);
		profileCache.set(cwd, detected);
		return detected;
	}

	function activateContextualProfiles(cwd: string, text: string): void {
		const detected = getDetectedProfiles(cwd);
		const matched = contextualProfilesForText(detected, text);
		activateContextualProfileMatches(cwd, matched);
	}

	function activateContextualProfileMatches(cwd: string, matched: string[]): void {
		if (matched.length === 0) return;

		const active = activeContextualProfiles.get(cwd) ?? new Set<string>();
		for (const profile of matched) active.add(profile);
		activeContextualProfiles.set(cwd, active);
	}

	function inactiveContextualProfiles(cwd: string, profiles: string[]): string[] {
		const active = activeContextualProfiles.get(cwd) ?? new Set<string>();
		return profiles.filter((profile) => !active.has(profile));
	}

	function getProfilesForTurn(cwd: string, prompt: string): string[] {
		const detected = getDetectedProfiles(cwd);
		const active = [...(activeContextualProfiles.get(cwd) ?? new Set<string>())];
		const prompted = contextualProfilesForText(detected, prompt);

		return uniqueProfiles([...baseProfiles(detected), ...active, ...prompted]);
	}

	pi.on("tool_call", (event: ToolCallEvent, ctx: ExtensionContext) => {
		const path = pathFromToolInput(event.input);
		if (!path || !isCodePath(path)) return;

		activateContextualProfiles(ctx.cwd, path);
	});

	pi.on("tool_result", (event: ToolResultEvent, ctx: ExtensionContext) => {
		if (event.toolName !== "read" || event.isError) return;

		const path = pathFromToolInput(event.input);
		if (!path || !isCodePath(path)) return;
		if (inactiveContextualProfiles(ctx.cwd, ["wordpress-blocks"]).length === 0) return;

		const text = event.content
			.filter((content) => content.type === "text")
			.map((content) => content.text)
			.join("\n");
		if (!text) return;

		const detected = getDetectedProfiles(ctx.cwd);
		const matched = contextualProfilesForToolResult(detected, `${path}\n${text}`);
		activateContextualProfileMatches(ctx.cwd, inactiveContextualProfiles(ctx.cwd, matched));
	});

	pi.on("before_agent_start", (event, ctx) => {
		const cwd = ctx.cwd;
		const prompt = event.prompt ?? "";
		const normalizedPrompt = prompt.toLowerCase();
		const profiles = getProfilesForTurn(cwd, prompt);
		const workflowFiles = workflowFilesForPrompt(normalizedPrompt);
		const messages = [];

		if (profiles.length > 0 && promptHasAnySkill(normalizedPrompt)) {
			const conventions = loadConventions(repoDir, profiles);
			if (conventions) {
				const conventionKey = `conventions:${profiles.join(",")}:${hashText(conventions)}`;
				if (shouldInject(cwd, conventionKey)) {
					messages.push(
						contextMessage(
							"pi-code-context",
							[`<pi-code-context profiles="${profiles.join(", ")}">`, conventions, "</pi-code-context>"].join("\n"),
						),
					);
				}
			}
		}

		if (promptHasAnySkill(normalizedPrompt) && workflowFiles.length > 0) {
			const workflowContext = loadWorkflowContext(repoDir, workflowFiles);
			if (workflowContext) {
				const isTaskWorkflow = promptHasSkill(normalizedPrompt, "task");
				const workflowKey = `workflow:${workflowFiles.join(",")}:${hashText(workflowContext)}`;
				if (isTaskWorkflow || shouldInject(cwd, workflowKey)) {
					messages.push(
						contextMessage(
							"pi-code-workflow",
							[`<pi-code-workflow files="${workflowFiles.join(" ")}">`, workflowContext, "</pi-code-workflow>"].join(
								"\n",
							),
						),
					);
				}
			}
		}

		if (messages.length > 0) {
			return { messages };
		}

		if (profiles.length === 0) return;

		const profileList = profiles.join(", ");
		const preamble = [
			"",
			"",
			"# Project Convention Context",
			`This is a ${profileList} project with active pi-code conventions.`,
			"When writing or modifying code, follow the conventions for this project type.",
			"If the local code predates current conventions, match the surrounding style enough to keep the change maintainable, while applying current safety and correctness conventions where practical.",
			`Conventions are loaded from ${repoDir}/profiles/.`,
			"Available pi-code skills: /task (task framing), /plan (implementation planning), /code (approved implementation), /test (test selection and interpretation), /docs (documentation), /review (pre-PR check), /commit (commit or PR prose).",
		].join("\n");

		return {
			systemPrompt: event.systemPrompt + preamble,
		};
	});
}
