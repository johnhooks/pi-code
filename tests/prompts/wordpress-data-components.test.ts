import { expect, test } from "vitest";
import { matchPromptProfiles } from "../helpers/profile-fixtures.js";

test("matches WordPress data and components prompt profiles", async () => {
	await expect(
		matchPromptProfiles(["javascript", "wordpress-data", "wordpress-components"], "wordpress-data-components.md"),
	).resolves.toMatchSnapshot();
});
