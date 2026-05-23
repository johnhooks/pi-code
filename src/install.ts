import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export interface InstallOptions {
	repoDir: string;
	projectDir: string;
}

export interface InstallResult {
	settingsPath: string;
	packageSource: string;
	changed: boolean;
}

interface PiSettings {
	packages?: unknown[];
	[key: string]: unknown;
}

export function install(options: InstallOptions): InstallResult {
	const piDir = join(options.projectDir, ".pi");
	const settingsPath = join(piDir, "settings.json");
	mkdirSync(piDir, { recursive: true });

	const existingContent = existsSync(settingsPath) ? readFileSync(settingsPath, "utf-8") : null;
	const settings = readSettings(existingContent);
	const indent = detectIndent(existingContent);
	const packages = Array.isArray(settings.packages) ? settings.packages : [];
	const packageSource = options.repoDir;
	const changed = !packages.some((entry) => packageEntrySource(entry) === packageSource);

	if (changed) {
		settings.packages = [...packages, packageSource];
		writeFileSync(settingsPath, formatSettings(settings, indent), "utf-8");
	} else if (!existsSync(settingsPath)) {
		writeFileSync(settingsPath, formatSettings(settings, indent), "utf-8");
	}

	return { settingsPath, packageSource, changed };
}

function readSettings(content: string | null): PiSettings {
	if (!content) return { packages: [] };

	try {
		const parsed: unknown = JSON.parse(content);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as PiSettings;
	} catch {}

	return { packages: [] };
}

function detectIndent(content: string | null): string {
	if (!content) return "\t";

	const line = content.split("\n").find((candidate) => /^(\t+| +)\S/.test(candidate));
	if (!line) return "\t";
	const match = line.match(/^(\t+| +)/);
	return match?.[1] ?? "\t";
}

function formatSettings(settings: PiSettings, indent: string): string {
	return `${JSON.stringify(settings, null, indent)}\n`;
}

function packageEntrySource(entry: unknown): string | null {
	if (typeof entry === "string") return entry;
	if (entry && typeof entry === "object") {
		const source = (entry as Record<string, unknown>).source;
		return typeof source === "string" ? source : null;
	}
	return null;
}
