import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { ExtensionAPI, ToolCallEvent, ToolCallEventResult } from "@earendil-works/pi-coding-agent";
import { promptHasSkill } from "../workflows.js";

type CodeSkillPhase = "implementing" | "reviewing" | "cleaning";

interface CodeSkillState {
	phase: CodeSkillPhase;
	edited: boolean;
}

interface FollowUpMessage {
	customType: "pi-code-review" | "pi-code-cleanup";
	content: string;
}

type MessageSender = (message: FollowUpMessage) => void;

const CODE_REVIEW_WORKFLOW = "workflows/modes/code-review.md";
const CODE_CLEANUP_WORKFLOW = "workflows/modes/code-cleanup.md";
const FOLLOW_UP_PROMPT = "Continue the code workflow.";

export function registerCodeSkillWorkflow(pi: ExtensionAPI, repoDir: string): void {
	const workflow = createCodeSkillWorkflow(repoDir, (message) => {
		pi.sendMessage(
			{
				customType: message.customType,
				content: message.content,
				display: false,
			},
			{ deliverAs: "followUp", triggerTurn: true },
		);
	});

	pi.on("before_agent_start", (event, ctx) => {
		const systemPrompt = workflow.onBeforeAgentStart(ctx.cwd, event.prompt ?? "", event.systemPrompt);
		if (systemPrompt) return { systemPrompt };
	});

	pi.on("tool_call", (event, ctx) => {
		return workflow.onToolCall(ctx.cwd, event);
	});

	pi.on("agent_end", (_event, ctx) => {
		workflow.onAgentEnd(ctx.cwd);
	});
}

export function createCodeSkillWorkflow(repoDir: string, sendMessage: MessageSender) {
	const states = new Map<string, CodeSkillState>();

	function onBeforeAgentStart(cwd: string, prompt: string, systemPrompt?: string): string | undefined {
		if (promptHasSkill(prompt.toLowerCase(), "code")) {
			states.set(cwd, { phase: "implementing", edited: false });
			return undefined;
		}

		const state = states.get(cwd);
		if (!state || !systemPrompt) return undefined;

		const workflowContext = workflowContextForPhase(repoDir, state.phase);
		if (!workflowContext) return undefined;

		return `${systemPrompt}\n\n${workflowContext}`;
	}

	function onToolCall(cwd: string, event: Pick<ToolCallEvent, "toolName">): ToolCallEventResult | undefined {
		const state = states.get(cwd);
		if (!state) return undefined;

		if (state.phase === "reviewing" && isEditTool(event.toolName)) {
			return { block: true, reason: "Code review pass must not edit files. Save edits for the cleanup pass." };
		}

		if (state.phase === "implementing" && isEditTool(event.toolName)) state.edited = true;
		return undefined;
	}

	function onAgentEnd(cwd: string): void {
		const state = states.get(cwd);
		if (!state) return;

		if (state.phase === "implementing") {
			if (!state.edited) {
				states.delete(cwd);
				return;
			}

			states.set(cwd, { phase: "reviewing", edited: false });
			sendMessage({ customType: "pi-code-review", content: FOLLOW_UP_PROMPT });
			return;
		}

		if (state.phase === "reviewing") {
			states.set(cwd, { phase: "cleaning", edited: false });
			sendMessage({ customType: "pi-code-cleanup", content: FOLLOW_UP_PROMPT });
			return;
		}

		states.delete(cwd);
	}

	function getState(cwd: string): CodeSkillState | undefined {
		const state = states.get(cwd);
		return state ? { ...state } : undefined;
	}

	return { onBeforeAgentStart, onToolCall, onAgentEnd, getState };
}

function workflowContextForPhase(repoDir: string, phase: CodeSkillPhase): string | undefined {
	const file = phase === "reviewing" ? CODE_REVIEW_WORKFLOW : phase === "cleaning" ? CODE_CLEANUP_WORKFLOW : undefined;
	if (!file) return undefined;

	const path = join(repoDir, file);
	if (!existsSync(path)) return undefined;

	try {
		return [`# Code Workflow Context`, `<!-- ${file} -->`, readFileSync(path, "utf-8")].join("\n");
	} catch {
		return undefined;
	}
}

function isEditTool(toolName: string): boolean {
	return toolName === "edit" || toolName === "write";
}
