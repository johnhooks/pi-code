import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vitest";
import { install } from "../src/install.js";

function tempDir() {
	return mkdtempSync(join(tmpdir(), "pi-code-install-test-"));
}

test("install creates project pi settings with pi-code package source", () => {
	const repoDir = tempDir();
	const projectDir = tempDir();

	const result = install({ repoDir, projectDir });
	const settings = JSON.parse(readFileSync(join(projectDir, ".pi/settings.json"), "utf-8"));

	expect(result.changed).toBe(true);
	expect(result.settingsPath).toBe(join(projectDir, ".pi/settings.json"));
	expect(settings.packages).toEqual([repoDir]);
});

test("install appends pi-code package source to existing settings", () => {
	const repoDir = tempDir();
	const projectDir = tempDir();
	const piDir = join(projectDir, ".pi");
	writeFileSync(join(projectDir, "package.json"), "{}");
	mkdirSync(piDir, { recursive: true });
	writeFileSync(
		join(piDir, "settings.json"),
		JSON.stringify({ model: "test", packages: ["npm:other-package"] }, null, 2),
	);

	install({ repoDir, projectDir });
	const settings = JSON.parse(readFileSync(join(piDir, "settings.json"), "utf-8"));

	expect(settings.model).toBe("test");
	expect(settings.packages).toEqual(["npm:other-package", repoDir]);
	expect(readFileSync(join(piDir, "settings.json"), "utf-8").includes('\n  "model"')).toBeTruthy();
});

test("install is idempotent", () => {
	const repoDir = tempDir();
	const projectDir = tempDir();

	install({ repoDir, projectDir });
	const result = install({ repoDir, projectDir });
	const settings = JSON.parse(readFileSync(join(projectDir, ".pi/settings.json"), "utf-8"));

	expect(result.changed).toBe(false);
	expect(settings.packages).toEqual([repoDir]);
});

test("install recognizes object package entries", () => {
	const repoDir = tempDir();
	const projectDir = tempDir();
	const piDir = join(projectDir, ".pi");
	mkdirSync(piDir, { recursive: true });
	writeFileSync(join(piDir, "settings.json"), JSON.stringify({ packages: [{ source: repoDir, skills: [] }] }));

	const result = install({ repoDir, projectDir });
	const settings = JSON.parse(readFileSync(join(piDir, "settings.json"), "utf-8"));

	expect(result.changed).toBe(false);
	expect(settings.packages.length).toBe(1);
});

test("install creates pi directory", () => {
	const repoDir = tempDir();
	const projectDir = tempDir();

	install({ repoDir, projectDir });

	expect(existsSync(join(projectDir, ".pi"))).toBe(true);
});
