import { expect } from "vitest";
import { yarnFixture } from "../fixtures";
import { getCliPath } from "../utils/get-cli-path";
import { runCliCommand } from "../utils/run-cli-command";

yarnFixture.only("yarn", async ({ testDirectory }) => {
  const { output, errorCode } = await runCliCommand({
    command: "npx",
    args: [getCliPath(), "--production"],
    cwd: testDirectory,
  });

  expect(errorCode).toBe(0);
  expect(output).toContain("66 licenses are compliant");
});
