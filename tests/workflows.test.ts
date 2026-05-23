import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { AgentSession, parseSkillBlock } from "@earendil-works/pi-coding-agent";
import { expect, test } from "vitest";
import { promptHasAnySkill, promptHasSkill, workflowFilesForPrompt, workflowFilesForSkill } from "../src/workflows.js";

function tempDir(): string {
	return mkdtempSync(join(tmpdir(), "pi-code-workflows-test-"));
}

type SkillExpander = {
	_expandSkillCommand(prompt: string): string;
};

function piExpandedSkillPrompt(name: string, args = ""): string {
	const root = tempDir();
	const baseDir = join(root, name);
	const filePath = join(baseDir, "SKILL.md");
	mkdirSync(baseDir, { recursive: true });
	writeFileSync(filePath, `---\nname: ${name}\ndescription: Test skill\n---\nUse this skill.`);

	const fakeSession = {
		resourceLoader: {
			getSkills: () => ({ skills: [{ name, filePath, baseDir }] }),
		},
		_extensionRunner: {
			emitError: () => {},
		},
	};

	return (AgentSession.prototype as unknown as SkillExpander)._expandSkillCommand.call(
		fakeSession,
		args ? `/skill:${name} ${args}` : `/skill:${name}`,
	);
}

test("promptHasSkill detects Pi skill invocation blocks", () => {
	const prompt = piExpandedSkillPrompt("task", "Draft a task.");
	const parsed = parseSkillBlock(prompt);

	expect(parsed?.name).toBe("task");
	expect(parsed?.userMessage).toBe("Draft a task.");
	expect(promptHasSkill(prompt, "task")).toBe(true);
	expect(promptHasSkill(prompt, "test")).toBe(false);
	expect(promptHasAnySkill(prompt)).toBe(true);
});

test("promptHasSkill does not match slash-like paths or plain slash commands", () => {
	const prompt = "Please inspect /tests/unit/example.test.ts and run /test if needed.";

	expect(promptHasSkill(prompt, "test")).toBe(false);
	expect(promptHasAnySkill(prompt)).toBe(false);
	expect(workflowFilesForPrompt(prompt)).toEqual([]);
});

test("workflowFilesForPrompt returns workflows for expanded skill blocks", () => {
	expect(workflowFilesForPrompt(piExpandedSkillPrompt("task"))).toEqual(["workflows/writing.md", "workflows/task.md"]);
	expect(workflowFilesForPrompt(piExpandedSkillPrompt("code"))).toEqual(["workflows/code.md"]);
});

test("workflowFilesForPrompt layers mode hints on skill workflows", () => {
	expect(workflowFilesForPrompt(piExpandedSkillPrompt("code", "Fix this security regression."))).toEqual([
		"workflows/code.md",
		"workflows/modes/debugging.md",
		"workflows/modes/security.md",
	]);
});

test("workflowFilesForSkill returns registered workflow files", () => {
	expect(workflowFilesForSkill("plan")).toEqual(["workflows/writing.md", "workflows/plan.md"]);
	expect(workflowFilesForSkill("missing")).toEqual([]);
});
