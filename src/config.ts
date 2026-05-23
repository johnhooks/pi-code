import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface PiCodeProjectConfig {
	profiles?: string[];
	wip?: {
		tasksDir?: string;
		plansDir?: string;
	};
}

export function loadProjectConfig(cwd: string): PiCodeProjectConfig | null {
	const configPath = join(cwd, ".pi-code", "config.json");
	if (!existsSync(configPath)) return null;

	try {
		return JSON.parse(readFileSync(configPath, "utf-8"));
	} catch {
		return null;
	}
}
