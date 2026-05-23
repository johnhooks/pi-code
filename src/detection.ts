import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface ProfileDefinition {
	description?: string;
	detect: string[];
	requires?: string[];
}

export interface ProfileRegistry {
	profiles: Record<string, ProfileDefinition>;
}

export function loadRegistry(repoDir: string): ProfileRegistry | null {
	const registryPath = join(repoDir, "profiles", "registry.json");
	if (!existsSync(registryPath)) return null;

	try {
		return JSON.parse(readFileSync(registryPath, "utf-8"));
	} catch {
		return null;
	}
}

export function checkRule(rule: string, projectDir: string): boolean {
	if (rule.endsWith("/")) {
		return existsSync(join(projectDir, rule));
	}

	const colonIdx = rule.indexOf(":");
	const filePart = colonIdx === -1 ? rule : rule.slice(0, colonIdx);
	const patternPart = colonIdx === -1 ? null : rule.slice(colonIdx + 1);

	if (patternPart === null) {
		if (hasGlob(filePart)) {
			return matchingTopLevelFiles(projectDir, filePart).length > 0;
		}

		return existsSync(join(projectDir, filePart));
	}

	if (hasGlob(filePart)) {
		return matchingTopLevelFiles(projectDir, filePart).some((filePath) => fileContains(filePath, patternPart));
	}

	const filePath = join(projectDir, filePart);
	if (!existsSync(filePath)) return false;

	try {
		const content = readFileSync(filePath, "utf-8");

		if (filePart.endsWith(".json")) {
			const keys = patternPart.split(".");
			let obj: unknown = JSON.parse(content);
			for (const key of keys) {
				if (obj && typeof obj === "object" && key in obj) {
					obj = (obj as Record<string, unknown>)[key];
				} else {
					return false;
				}
			}
			return true;
		}

		return content.includes(patternPart);
	} catch {
		return false;
	}
}

function hasGlob(pattern: string): boolean {
	return pattern.includes("*");
}

function matchingTopLevelFiles(projectDir: string, pattern: string): string[] {
	try {
		const re = globPatternToRegExp(pattern);
		return readdirSync(projectDir)
			.filter((entry) => re.test(entry))
			.map((entry) => join(projectDir, entry));
	} catch {
		return [];
	}
}

function fileContains(filePath: string, pattern: string): boolean {
	try {
		return readFileSync(filePath, "utf-8").includes(pattern);
	} catch {
		return false;
	}
}

function globPatternToRegExp(pattern: string): RegExp {
	const source = pattern
		.split("*")
		.map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
		.join(".*");
	return new RegExp(`^${source}$`);
}

export function detectProfiles(projectDir: string, registry: ProfileRegistry): string[] {
	const matched: string[] = [];

	for (const [name, profile] of Object.entries(registry.profiles)) {
		if (profile.detect.length === 0) continue;
		for (const rule of profile.detect) {
			if (checkRule(rule, projectDir)) {
				matched.push(name);
				break;
			}
		}
	}

	return resolveProfileDependencies(matched, registry);
}

export function resolveProfileDependencies(profiles: string[], registry: ProfileRegistry): string[] {
	const resolved = new Set<string>();
	const queue = [...profiles];

	while (queue.length > 0) {
		const name = queue.shift();
		if (!name || resolved.has(name)) continue;
		resolved.add(name);
		queue.push(...(registry.profiles[name]?.requires ?? []));
	}

	return [...resolved];
}
