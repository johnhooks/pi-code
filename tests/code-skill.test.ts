import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { ToolCallEvent } from "@earendil-works/pi-coding-agent";
import { expect, test } from "vitest";
import { createCodeSkillWorkflow } from "../src/skills/code.js";

type FollowUpMessage = {
	customType: "pi-code-review" | "pi-code-cleanup";
	content: string;
};

const cwd = "/project";
const codeSkillPrompt = '<skill name="code" location="/skills/code/SKILL.md">Implement this.</skill>';

function tempRepo(): string {
	const repoDir = mkdtempSync(join(tmpdir(), "pi-code-code-skill-test-"));
	mkdirSync(join(repoDir, "workflows/modes"), { recursive: true });
	writeFileSync(join(repoDir, "workflows/modes/code-review.md"), "# Review\n\nReview instructions.");
	writeFileSync(join(repoDir, "workflows/modes/code-cleanup.md"), "# Cleanup\n\nCleanup instructions.");
	return repoDir;
}

function editTool(name: string): Pick<ToolCallEvent, "toolName"> {
	return { toolName: name };
}

test("code skill workflow runs review and cleanup after implementation edits", () => {
	const messages: FollowUpMessage[] = [];
	const workflow = createCodeSkillWorkflow(tempRepo(), (message) => messages.push(message));

	workflow.onBeforeAgentStart(cwd, codeSkillPrompt);
	workflow.onToolCall(cwd, editTool("edit"));
	workflow.onAgentEnd(cwd);

	expect(workflow.getState(cwd)).toEqual({ phase: "reviewing", edited: false });
	expect(messages.length).toBe(1);
	expect(messages[0].customType).toBe("pi-code-review");
	expect(messages[0].content).toBe("Continue the code workflow.");

	workflow.onAgentEnd(cwd);

	expect(workflow.getState(cwd)).toEqual({ phase: "cleaning", edited: false });
	expect(messages.length).toBe(2);
	expect(messages[1].customType).toBe("pi-code-cleanup");

	workflow.onAgentEnd(cwd);

	expect(workflow.getState(cwd)).toBe(undefined);
});

test("code skill workflow injects phase workflow context", () => {
	const workflow = createCodeSkillWorkflow(tempRepo(), () => {});

	workflow.onBeforeAgentStart(cwd, codeSkillPrompt);
	workflow.onToolCall(cwd, editTool("write"));
	workflow.onAgentEnd(cwd);

	const reviewPrompt = workflow.onBeforeAgentStart(cwd, "Continue the code workflow.", "base prompt");
	expect(reviewPrompt?.includes("base prompt")).toBeTruthy();
	expect(reviewPrompt?.includes("workflows/modes/code-review.md")).toBeTruthy();
	expect(reviewPrompt?.includes("Review instructions.")).toBeTruthy();

	workflow.onAgentEnd(cwd);
	const cleanupPrompt = workflow.onBeforeAgentStart(cwd, "Continue the code workflow.", "base prompt");
	expect(cleanupPrompt?.includes("workflows/modes/code-cleanup.md")).toBeTruthy();
	expect(cleanupPrompt?.includes("Cleanup instructions.")).toBeTruthy();
});

test("code skill workflow blocks edits during review", () => {
	const workflow = createCodeSkillWorkflow(tempRepo(), () => {});

	workflow.onBeforeAgentStart(cwd, codeSkillPrompt);
	workflow.onToolCall(cwd, editTool("edit"));
	workflow.onAgentEnd(cwd);

	expect(workflow.onToolCall(cwd, editTool("write"))).toEqual({
		block: true,
		reason: "Code review pass must not edit files. Save edits for the cleanup pass.",
	});
});

test("code skill workflow clears without follow-up when implementation made no edits", () => {
	const messages: FollowUpMessage[] = [];
	const workflow = createCodeSkillWorkflow(tempRepo(), (message) => messages.push(message));

	workflow.onBeforeAgentStart(cwd, codeSkillPrompt);
	workflow.onAgentEnd(cwd);

	expect(workflow.getState(cwd)).toBe(undefined);
	expect(messages).toEqual([]);
});

test("code skill workflow ignores non-code skills", () => {
	const messages: FollowUpMessage[] = [];
	const workflow = createCodeSkillWorkflow(tempRepo(), (message) => messages.push(message));

	workflow.onBeforeAgentStart(cwd, '<skill name="plan">Plan this.</skill>');
	workflow.onToolCall(cwd, editTool("write"));
	workflow.onAgentEnd(cwd);

	expect(workflow.getState(cwd)).toBe(undefined);
	expect(messages).toEqual([]);
});
