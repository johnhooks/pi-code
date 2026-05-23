import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vitest";
import { checkRule, detectProfiles, resolveProfileDependencies } from "../src/detection.js";

function tempProject() {
	return mkdtempSync(join(tmpdir(), "pi-code-test-"));
}

test("checkRule supports file existence", () => {
	const dir = tempProject();
	writeFileSync(join(dir, "composer.json"), "{}");

	expect(checkRule("composer.json", dir)).toBe(true);
	expect(checkRule("package.json", dir)).toBe(false);
});

test("checkRule supports content matches", () => {
	const dir = tempProject();
	writeFileSync(join(dir, "plugin.php"), "<?php\n/* Plugin Name: Example Plugin */");

	expect(checkRule("plugin.php:Plugin Name:", dir)).toBe(true);
	expect(checkRule("plugin.php:Theme Name:", dir)).toBe(false);
});

test("checkRule supports JSON key lookup", () => {
	const dir = tempProject();
	writeFileSync(join(dir, "package.json"), JSON.stringify({ dependencies: { "@wordpress/data": "latest" } }));

	expect(checkRule("package.json:dependencies.@wordpress/data", dir)).toBe(true);
	expect(checkRule("package.json:dependencies.react", dir)).toBe(false);
});

test("checkRule supports simple top-level globs", () => {
	const dir = tempProject();
	writeFileSync(join(dir, "plugin.php"), "<?php");

	expect(checkRule("*.php", dir)).toBe(true);
	expect(checkRule("*.md", dir)).toBe(false);
});

test("checkRule supports top-level glob content matches", () => {
	const dir = tempProject();
	writeFileSync(join(dir, "plugin.php"), "<?php\n/* Plugin Name: Example Plugin */");
	writeFileSync(join(dir, "theme.php"), "<?php\n/* Theme Name: Example Theme */");

	expect(checkRule("*.php:Plugin Name:", dir)).toBe(true);
	expect(checkRule("*.php:Requires Plugins:", dir)).toBe(false);
});

test("detectProfiles includes dependencies", () => {
	const dir = tempProject();
	writeFileSync(join(dir, "composer.json"), "{}");
	mkdirSync(join(dir, "tests"));

	const registry = {
		profiles: {
			php: { detect: ["composer.json"], requires: [] },
			codeception: { detect: ["tests/"], requires: ["php"] },
			laravel: { detect: ["artisan"], requires: ["php"] },
		},
	};

	expect(detectProfiles(dir, registry)).toEqual(["php", "codeception"]);
});

test("resolveProfileDependencies avoids duplicates and cycles", () => {
	const registry = {
		profiles: {
			a: { detect: [], requires: ["b"] },
			b: { detect: [], requires: ["a"] },
		},
	};

	expect(resolveProfileDependencies(["a"], registry)).toEqual(["a", "b"]);
});
