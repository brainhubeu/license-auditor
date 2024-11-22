import { describe, expect, test } from "vitest";
import type { TestContext } from "./test-project-setup";
import { addPackage } from "./utils/add-package";
import { getCliPath } from "./utils/get-cli-path";
import { runCliCommand } from "./utils/run-cli-command";

describe("license-auditor", () => {
  describe("cli", () => {
    test("audits compliant packages correctly", async (context: TestContext) => {
      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath()],
        cwd: context.testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("66 licenses are compliant");
    });

    test("detects non-compliant packages correctly", async (context: TestContext) => {
      await addPackage(
        context.testDirectory,
        "node_modules/testing-blueoak-package",
        {
          version: "1.0.0",
          license: "BlueOak-1.0.0",
        },
      );

      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath()],
        cwd: context.testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("66 licenses are compliant");
      expect(output).toContain("1 license is blacklisted");
    });
  });
});
