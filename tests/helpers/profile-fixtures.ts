import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { contextualProfilesForText, contextualProfilesForToolResult } from "../../src/contextual-profiles.js";
import { detectProfiles, loadRegistry } from "../../src/detection.js";

export const repoDir = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
export const fixturesDir = join(repoDir, "tests", "fixtures");

export function fixturePath(...parts: string[]): string {
	return join(fixturesDir, ...parts);
}

export function projectFixturePath(name: string): string {
	return fixturePath("projects", name);
}

export async function promptFixture(name: string): Promise<string> {
	return readFile(fixturePath("prompts", name), "utf8");
}

export async function toolReadFixture(name: string): Promise<string> {
	return readFile(fixturePath("tool-reads", name), "utf8");
}

export function registryFixture() {
	const registry = loadRegistry(repoDir);
	if (!registry) throw new Error("Could not load profile registry for fixture tests.");

	return registry;
}

export function detectProjectFixture(name: string): string[] {
	return detectProfiles(projectFixturePath(name), registryFixture());
}

export async function matchPromptProfiles(profiles: string[], name: string): Promise<string[]> {
	return contextualProfilesForText(profiles, await promptFixture(name));
}

export async function matchToolReadProfiles(profiles: string[], name: string): Promise<string[]> {
	return contextualProfilesForToolResult(profiles, await toolReadFixture(name));
}
