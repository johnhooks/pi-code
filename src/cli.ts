import { resolve } from "node:path";
import { install } from "./install.js";

interface CliOptions {
	repoDir: string;
	argv: string[];
	cwd?: string;
}

export function runCli(options: CliOptions): number {
	const cwd = options.cwd ?? process.env.PI_CODE_CWD ?? process.cwd();
	const [command, ...rest] = options.argv;

	if (!command || command === "help" || command === "--help" || command === "-h") {
		printUsage();
		return 0;
	}

	if (command === "install") {
		return runInstall(options.repoDir, cwd, rest);
	}

	printUsage();
	return 1;
}

function runInstall(repoDir: string, cwd: string, args: string[]): number {
	const projectDir = resolve(cwd, args[0] ?? ".");
	const result = install({ repoDir, projectDir });
	const action = result.changed ? "Installed" : "Already installed";

	console.log(`${action} pi-code in ${result.settingsPath}`);
	console.log(`Package source: ${result.packageSource}`);
	return 0;
}

function printUsage(): void {
	console.log(`Usage:
  pi-code install [project-dir]

Examples:
  pi-code install .
  pi-code install /path/to/project`);
}
