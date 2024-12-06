import { expect } from "vitest";
import { defaultTest, monorepoFixture, pnpmFixture } from "../fixtures";
import { getCliPath } from "../utils/get-cli-path";
import { runCliCommand } from "../utils/run-cli-command";

monorepoFixture("monorepo", async ({ testDirectory }) => {
  const { output, errorCode } = await runCliCommand({
    command: "npx",
    args: [getCliPath(), "--production", "--verbose"],
    cwd: testDirectory,
  });

  expect(errorCode).toBe(0);
  expect(output).toContain("68 licenses are compliant");
});
