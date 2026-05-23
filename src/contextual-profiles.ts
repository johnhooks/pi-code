import { extname } from "node:path";

const CONTEXTUAL_PROFILES = new Set(["wordpress-blocks", "wordpress-components", "wordpress-data"]);

const TOOL_RESULT_SCAN_LIMIT = 128 * 1024;

const CONTEXTUAL_PROFILE_HINTS: Record<string, RegExp[]> = {
	"wordpress-blocks": [
		/\bblocks?\b/i,
		/\bblock\.json$/,
		/@wordpress\/block-editor/,
		/\bregisterBlockType\b/,
		/\bregister_block_type_from_metadata\b/,
		/\buseBlockProps\b/,
		/\bget_block_wrapper_attributes\b/,
	],
	"wordpress-data": [
		/@wordpress\/data/,
		/\buseSelect\b/,
		/\buseDispatch\b/,
		/\bcreateReduxStore\b/,
		/\bcreateSelector\b/,
		/\bcreateRegistrySelector\b/,
		/\bdatastore\b/,
		/\bselectors?\.(t|j)sx?$/,
		/\bresolvers?\.(t|j)sx?$/,
	],
	"wordpress-components": [
		/@wordpress\/components/,
		/@wordpress\/icons/,
		/\bSlotFillProvider\b/,
		/\bTextControl\b/,
		/\bModal\b/,
		/\bcomponents?\//,
	],
};

const TOOL_RESULT_PROFILE_HINTS: Record<string, RegExp[]> = {
	"wordpress-blocks": [
		/\bblock\.json(?:\n|$)/,
		/@wordpress\/block-editor/,
		/\bregisterBlockType\b/,
		/\bregister_block_type_from_metadata\b/,
		/\buseBlockProps\b/,
		/\bget_block_wrapper_attributes\b/,
	],
};

export function baseProfiles(profiles: string[]): string[] {
	return profiles.filter((profile) => !CONTEXTUAL_PROFILES.has(profile));
}

export function contextualProfiles(profiles: string[]): string[] {
	return profiles.filter((profile) => CONTEXTUAL_PROFILES.has(profile));
}

export function contextualProfilesForText(availableProfiles: string[], text: string): string[] {
	return contextualProfiles(availableProfiles).filter((profile) =>
		(CONTEXTUAL_PROFILE_HINTS[profile] ?? []).some((hint) => hint.test(text)),
	);
}

export function contextualProfilesForToolResult(profiles: string[], text: string): string[] {
	const availableProfiles = new Set(contextualProfiles(profiles));
	if (profiles.includes("wordpress")) availableProfiles.add("wordpress-blocks");

	const scannedText = text.slice(0, TOOL_RESULT_SCAN_LIMIT);
	return [...availableProfiles].filter((profile) =>
		(TOOL_RESULT_PROFILE_HINTS[profile] ?? []).some((hint) => hint.test(scannedText)),
	);
}

export function pathFromToolInput(input: unknown): string | null {
	if (!input || typeof input !== "object") return null;
	const path = (input as Record<string, unknown>).path;
	return typeof path === "string" ? path : null;
}

export function isCodePath(path: string): boolean {
	return [".json", ".js", ".jsx", ".ts", ".tsx", ".php"].includes(extname(path));
}

export function uniqueProfiles(profiles: string[]): string[] {
	return [...new Set(profiles)];
}
