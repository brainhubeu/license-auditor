import * as path from "node:path";
import { describe } from "vitest";
import {
  defaultTest,
  monorepoFixture,
  pnpmFixture,
  yarnFixture,
} from "../fixtures";
import { getCliPath } from "../utils/get-cli-path";
import { readJsonFile } from "../utils/read-json-file";
import { runCliCommand } from "../utils/run-cli-command";
import "../utils/path-serializer";

describe("snapshot testing", () => {
  monorepoFixture("monorepo project", async ({ testDirectory, expect }) => {
    const { errorCode } = await runCliCommand({
      command: "npx",
      args: [getCliPath(), "--verbose", "--json"],
      cwd: testDirectory,
    });

    expect(errorCode).toBe(0);

    const jsonOutput = await readJsonFile(
      path.join(testDirectory, "license-auditor.results.json"),
    );
    expect(jsonOutput).toMatchSnapshot();
  });

  pnpmFixture("pnpm project", async ({ testDirectory, expect }) => {
    const { errorCode } = await runCliCommand({
      command: "npx",
      args: [getCliPath(), "--verbose", "--json"],
      cwd: testDirectory,
    });

    expect(errorCode).toBe(0);

    const jsonOutput = await readJsonFile(
      path.join(testDirectory, "license-auditor.results.json"),
    );
    expect(jsonOutput).toMatchSnapshot();
  });

  defaultTest("npm project", async ({ testDirectory, expect }) => {
    const { errorCode } = await runCliCommand({
      command: "npx",
      args: [getCliPath(), "--verbose", "--json"],
      cwd: testDirectory,
    });

    expect(errorCode).toBe(0);

    const jsonOutput = await readJsonFile(
      path.join(testDirectory, "license-auditor.results.json"),
    );
    expect(jsonOutput).toMatchSnapshot();
  });

  yarnFixture("yarn project", async ({ testDirectory, expect }) => {
    const { errorCode } = await runCliCommand({
      command: "npx",
      args: [getCliPath(), "--verbose", "--json"],
      cwd: testDirectory,
    });

    expect(errorCode).toBe(0);

    const jsonOutput = await readJsonFile(
      path.join(testDirectory, "license-auditor.results.json"),
    );
    expect(jsonOutput).toMatchSnapshot();
  });
});
