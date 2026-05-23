import { expect, test } from "vitest";
import { matchToolReadProfiles } from "../helpers/profile-fixtures.js";

const wordpressProjectProfiles = ["php", "javascript", "wordpress"];

test("matches WordPress blocks from block registration tool read", async () => {
	await expect(matchToolReadProfiles(wordpressProjectProfiles, "block-registration.php")).resolves.toMatchSnapshot();
});

test("matches WordPress blocks from block.json tool read", async () => {
	await expect(matchToolReadProfiles(wordpressProjectProfiles, "block-json-read.txt")).resolves.toMatchSnapshot();
});
