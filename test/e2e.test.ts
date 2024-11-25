import { describe, expect } from "vitest";
import { addPackage } from "./utils/add-package";
import { getCliPath } from "./utils/get-cli-path";
import { runCliCommand } from "./utils/run-cli-command";

import { defaultTest, legacyPeerDepsTest } from "./fixtures";

describe("license-auditor", () => {
  describe("cli", () => {
    defaultTest(
      "audits compliant packages correctly",
      async ({ testDirectory }) => {
        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath()],
          cwd: testDirectory,
        });

        console.log("first output", output);
        expect(errorCode).toBe(0);
        expect(output).toContain("246 licenses are compliant");
      },
    );

    defaultTest(
      "detects non-compliant packages correctly",
      async ({ testDirectory }) => {
        await addPackage(
          testDirectory,
          "node_modules/testing-blueoak-package",
          {
            version: "1.0.0",
            license: "BlueOak-1.0.0",
          },
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath()],
          cwd: testDirectory,
        });

        expect(errorCode).toBe(0);
        expect(output).toContain("246 licenses are compliant");
        expect(output).toContain("2 licenses are blacklisted");
      },
    );

    defaultTest(
      "audits compliant production-only dependencies",
      async ({ testDirectory }) => {
        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--production"],
          cwd: testDirectory,
        });

        expect(errorCode).toBe(0);
        expect(output).toContain("77 licenses are compliant");
      },
    );

    legacyPeerDepsTest("legacy peer deps", async ({ testDirectory }) => {
      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath()],
        cwd: testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("Results incomplete because of an error.");
    });
  });
});
