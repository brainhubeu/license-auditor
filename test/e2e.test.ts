import * as fs from "node:fs/promises";
import * as path from "node:path";
import { describe, expect, test } from "vitest";
import type { TestContext } from "./test-project-setup";
import { addPackage } from "./utils/add-package";
import { execAsync } from "./utils/exec-async";
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
      expect(output).toContain("246 licenses are compliant");
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
      expect(output).toContain("246 licenses are compliant");
      expect(output).toContain("2 licenses are blacklisted");
    });

    test("legacy peer deps", async (context: TestContext) => {
      await fs.rm(path.resolve(context.testDirectory, "node_modules"), {
        recursive: true,
        force: true,
      });
      await execAsync("npm i --legacy-peer-deps", {
        cwd: path.resolve(__dirname, "testProject"),
      });

      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath()],
        cwd: context.testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("Results incomplete because of an error.");
    });
  });
});
