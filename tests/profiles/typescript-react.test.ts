import { expect, test } from "vitest";
import { detectProjectFixture } from "../helpers/profile-fixtures.js";

test("detects TypeScript React project profiles", () => {
	expect(detectProjectFixture("typescript-react")).toMatchSnapshot();
});
