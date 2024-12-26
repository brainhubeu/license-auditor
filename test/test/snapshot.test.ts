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
import { matchSnapshotRecursive } from "../utils/match-snapshot-recursive";

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
    matchSnapshotRecursive("./__snapshots__/monorepo.json", jsonOutput, false);
  });
  monorepoFixture(
    "monorepo project production only",
    async ({ testDirectory, expect }) => {
      const { errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--verbose", "--json", "--production"],
        cwd: testDirectory,
      });

      expect(errorCode).toBe(0);

      const jsonOutput = await readJsonFile(
        path.join(testDirectory, "license-auditor.results.json"),
      );
      matchSnapshotRecursive(
        "./__snapshots__/monorepo-production.json",
        jsonOutput,
        false,
      );
    },
  );

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
    matchSnapshotRecursive("./__snapshots__/pnpm.json", jsonOutput, false);
  });

  pnpmFixture(
    "pnpm project production only",
    async ({ testDirectory, expect }) => {
      const { errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--verbose", "--json", "--production"],
        cwd: testDirectory,
      });

      expect(errorCode).toBe(0);

      const jsonOutput = await readJsonFile(
        path.join(testDirectory, "license-auditor.results.json"),
      );
      matchSnapshotRecursive(
        "./__snapshots__/pnpm-production.json",
        jsonOutput,
        false,
      );
    },
  );

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
    matchSnapshotRecursive("./__snapshots__/npm.json", jsonOutput, false);
  });

  defaultTest(
    "npm project production only",
    async ({ testDirectory, expect }) => {
      const { errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--verbose", "--json", "--production"],
        cwd: testDirectory,
      });

      expect(errorCode).toBe(0);

      const jsonOutput = await readJsonFile(
        path.join(testDirectory, "license-auditor.results.json"),
      );
      matchSnapshotRecursive(
        "./__snapshots__/npm-production.json",
        jsonOutput,
        false,
      );
    },
  );

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
    matchSnapshotRecursive("./__snapshots__/yarn.json", jsonOutput, false);
  });

  yarnFixture(
    "yarn project production only",
    async ({ testDirectory, expect }) => {
      const { errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--verbose", "--json", "--production"],
        cwd: testDirectory,
      });

      expect(errorCode).toBe(0);

      const jsonOutput = await readJsonFile(
        path.join(testDirectory, "license-auditor.results.json"),
      );
      matchSnapshotRecursive(
        "./__snapshots__/yarn-production.json",
        jsonOutput,
        false,
      );
    },
  );
});
