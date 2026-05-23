import { expect, test } from "vitest";
import { detectProjectFixture } from "../helpers/profile-fixtures.js";

test("detects WordPress plugin profiles", () => {
	expect(detectProjectFixture("wordpress-plugin")).toMatchSnapshot();
});
