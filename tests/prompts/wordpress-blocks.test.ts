import { expect, test } from "vitest";
import { matchPromptProfiles } from "../helpers/profile-fixtures.js";

test("matches WordPress blocks prompt profiles", async () => {
	await expect(
		matchPromptProfiles(["php", "javascript", "wordpress", "wordpress-blocks"], "wordpress-blocks.md"),
	).resolves.toMatchSnapshot();
});
