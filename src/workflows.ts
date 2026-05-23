import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const WORKFLOWS_BY_SKILL: Record<string, string[]> = {
	task: ["workflows/writing.md", "workflows/task.md"],
	plan: ["workflows/writing.md", "workflows/plan.md"],
	code: ["workflows/code.md"],
	review: ["workflows/review.md"],
	test: ["workflows/test.md"],
	docs: ["workflows/document.md"],
	commit: ["workflows/writing.md"],
};

const MODE_HINTS: Array<[RegExp, string]> = [
	[/\b(refactor|rename|move|extract|restructure)\b/, "workflows/modes/refactoring.md"],
	[/\b(debug|bug|failing test|regression)\b/, "workflows/modes/debugging.md"],
	[/\b(docs|documentation|readme)\b/, "workflows/modes/documentation.md"],
	[/\b(security|auth|permission|nonce|csrf|xss|sql injection)\b/, "workflows/modes/security.md"],
];

export function workflowFilesForPrompt(prompt: string): string[] {
	const files: string[] = [];
	for (const [skill, workflowFiles] of Object.entries(WORKFLOWS_BY_SKILL)) {
		if (promptHasSkill(prompt, skill)) files.push(...workflowFiles);
	}

	for (const [hint, file] of MODE_HINTS) {
		if (hint.test(prompt)) files.push(file);
	}

	return [...new Set(files)];
}

export function workflowFilesForSkill(skill: string): string[] {
	return WORKFLOWS_BY_SKILL[skill] ?? [];
}

export function promptHasSkill(prompt: string, skill: string): boolean {
	return prompt.includes(`<skill name="${skill}"`);
}

export function promptHasAnySkill(prompt: string): boolean {
	return Object.keys(WORKFLOWS_BY_SKILL).some((skill) => promptHasSkill(prompt, skill));
}

export function resolveWorkflowPath(repoDir: string, file: string): string | null {
	const repoPath = join(repoDir, file);
	if (existsSync(repoPath)) return repoPath;

	return null;
}

export function loadWorkflowContext(repoDir: string, files: string[]): string {
	const sections: string[] = [];

	for (const file of files) {
		const resolved = resolveWorkflowPath(repoDir, file);
		if (!resolved) continue;
		try {
			sections.push(`<!-- ${file} -->\n${readFileSync(resolved, "utf-8")}`);
		} catch {}
	}

	return sections.join("\n\n---\n\n");
}
