import { expect, test } from "vitest";
import { contextualProfilesForText, contextualProfilesForToolResult } from "../src/contextual-profiles.js";

test("contextualProfilesForText matches camelCase and PascalCase prompt hints", () => {
	const profiles = ["javascript", "wordpress-data", "wordpress-components"];

	expect(contextualProfilesForText(profiles, "Update useSelect and TextControl usage.")).toEqual([
		"wordpress-data",
		"wordpress-components",
	]);
});

test("contextualProfilesForToolResult can activate blocks inside WordPress projects", () => {
	const profiles = ["php", "javascript", "wordpress"];
	const examples = ["registerBlockType( 'plugin/example', {} );", 'src/blocks/example/block.json\n{ "apiVersion": 3 }'];

	for (const example of examples) {
		expect(contextualProfilesForToolResult(profiles, example)).toEqual(["wordpress-blocks"]);
	}
});

test("contextualProfilesForToolResult ignores block hints outside WordPress projects", () => {
	const profiles = ["javascript"];

	expect(contextualProfilesForToolResult(profiles, "registerBlockType( 'plugin/example', {} );")).toEqual([]);
});
