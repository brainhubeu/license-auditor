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
        cwd: context.testDirectory,
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

  describe("parse license files", () => {
    test("parse license files: single license file with correct license", async (context: TestContext) => {
      await addPackage(
        context.testDirectory,
        "node_modules/testing-license-file",
        {
          version: "1.0.0",
        },
        [{ name: "LICENSE-MIT", content: "MIT" }],
      );

      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath()],
        cwd: context.testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("247 licenses are compliant");
    });

    test("parse license files: one correct license file and one incorrect license file", async (context: TestContext) => {
      await addPackage(
        context.testDirectory,
        "node_modules/testing-license-file",
        {
          version: "1.0.0",
        },
        [
          { name: "LICENSE-MIT", content: "MIT" },
          { name: "LICENSE-WRONG", content: "WRONG" },
        ],
      );

      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--verbose"],
        cwd: context.testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("1 package is requiring manual checking");
      expect(output).toContain(
        "We found some, but not all licenses for package",
      );
    });

    test("parse license files: single license file with incorrect license", async (context: TestContext) => {
      await addPackage(
        context.testDirectory,
        "node_modules/testing-license-file",
        {
          version: "1.0.0",
        },
        [{ name: "LICENSE-WRONG", content: "WRONG" }],
      );

      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--verbose"],
        cwd: context.testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("1 package is requiring manual checking");
      expect(output).toContain(
        "We’ve found a license file, but no matching licenses in",
      );
    });

    test("parse license files: two license files with correct licenses", async (context: TestContext) => {
      await addPackage(
        context.testDirectory,
        "node_modules/testing-license-file",
        {
          version: "1.0.0",
        },
        [
          { name: "LICENSE-MIT", content: "MIT" },
          { name: "LICENSE-ISC", content: "ISC" },
        ],
      );

      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath()],
        cwd: context.testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("247 licenses are compliant");
    });

    test("parse license files: two license files, one correct and one not whitelisted", async (context: TestContext) => {
      await addPackage(
        context.testDirectory,
        "node_modules/testing-license-file",
        {
          version: "1.0.0",
        },
        [
          { name: "LICENSE-MIT", content: "MIT" },
          { name: "LICENSE-AAL", content: "AAL" },
        ],
      );

      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--verbose"],
        cwd: context.testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("1 package is requiring manual checking");
      expect(output).toContain("Not all licenses are whitelisted");
    });
  });
});
