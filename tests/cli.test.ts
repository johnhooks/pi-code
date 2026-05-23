import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vitest";
import { runCli } from "../src/cli.js";

function tempDir(): string {
	return mkdtempSync(join(tmpdir(), "pi-code-cli-test-"));
}

test("runCli handles help", () => {
	const originalLog = console.log;
	const output: string[] = [];
	console.log = (message) => output.push(message);
	try {
		const exitCode = runCli({ repoDir: tempDir(), argv: ["--help"], cwd: tempDir() });
		expect(exitCode).toBe(0);
		expect(output.join("\n").includes("pi-code install")).toBeTruthy();
	} finally {
		console.log = originalLog;
	}
});

test("runCli handles unknown commands", () => {
	const originalLog = console.log;
	console.log = () => {};
	try {
		const exitCode = runCli({ repoDir: tempDir(), argv: ["unknown"], cwd: tempDir() });
		expect(exitCode).toBe(1);
	} finally {
		console.log = originalLog;
	}
});
