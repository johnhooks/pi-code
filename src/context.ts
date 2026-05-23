import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function resolveConventionPath(repoDir: string, profile: string): string | null {
	const repoPath = join(repoDir, "profiles", profile, "conventions.md");
	if (existsSync(repoPath)) return repoPath;

	return null;
}

export function loadConventions(repoDir: string, profiles: string[]): string {
	const sections: string[] = [];

	for (const profile of profiles) {
		const resolved = resolveConventionPath(repoDir, profile);
		if (!resolved) continue;
		try {
			sections.push(readFileSync(resolved, "utf-8"));
		} catch {}
	}

	return sections.join("\n\n---\n\n");
}

export function contextMessage(customType: string, text: string) {
	return {
		customType,
		content: [{ type: "text" as const, text }],
		display: false,
	};
}
