import { describe, expect } from "vitest";
import { addPackage } from "../utils/add-package";
import { getCliPath } from "../utils/get-cli-path";
import { runCliCommand } from "../utils/run-cli-command";

import {
  conflictingPeerDepsTest,
  defaultTest,
  legacyPeerDepsTest,
} from "../fixtures";

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
        expect(output).toContain("2 licenses are unknown");
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

    describe("parse license files", () => {
      defaultTest(
        "single license file with correct license",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "node_modules/testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }],
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath()],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("247 licenses are compliant");
        },
      );

      defaultTest(
        "one correct license file and one incorrect license file",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "node_modules/testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [
              { name: "LICENSE-MIT", content: "MIT" },
              { name: "LICENSE-WRONG", content: "WRONG" },
            ],
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--verbose"],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("1 package is requiring manual checking");
          expect(output).toContain(
            "We found some, but not all licenses for package",
          );
        },
      );

      defaultTest(
        "single license file with incorrect license",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "node_modules/testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-WRONG", content: "WRONG" }],
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--verbose"],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("1 package is requiring manual checking");
          expect(output).toContain(
            "We’ve found a license file, but no matching licenses in",
          );
        },
      );

      defaultTest(
        "two license files with correct licenses",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "node_modules/testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [
              { name: "LICENSE-MIT", content: "MIT" },
              { name: "LICENSE-ISC", content: "ISC" },
            ],
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath()],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("247 licenses are compliant");
        },
      );

      defaultTest(
        "two license files, one correct and one not whitelisted",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "node_modules/testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [
              { name: "LICENSE-MIT", content: "MIT" },
              { name: "LICENSE-AAL", content: "AAL" },
            ],
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--verbose"],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("1 package is requiring manual checking");
          expect(output).toContain("Not all licenses are whitelisted");
        },
      );

      defaultTest(
        "displays not found licenses in verbose table",
        async ({ testDirectory }) => {
          await addPackage(testDirectory, "node_modules/testing-no-license", {
            version: "1.0.0",
            license: "",
          });

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--verbose"],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("status");
          expect(output).toContain("not found");
          expect(output).toContain("testing-no-license");
        },
      );
    });
    describe("filter-regex flag", () => {
      defaultTest(
        "one package should be filtered with filter-regex flag",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "node_modules/@testing-lib/lib1",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }],
          );

          await addPackage(
            testDirectory,
            "node_modules/lib-test",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }],
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--filter-regex", "@testing-lib"],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("247 licenses are compliant");
        },
      );

      defaultTest(
        "two packages with same organization name should be filtered with filter-regex flag",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "node_modules/@testing-lib/lib1",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }],
          );

          await addPackage(
            testDirectory,
            "node_modules/@testing-lib/lib2",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }],
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--filter-regex", "@testing-lib"],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("246 licenses are compliant");
        },
      );
    });

    conflictingPeerDepsTest(
      "conflicting peer deps",
      async ({ testDirectory }) => {
        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath()],
          cwd: testDirectory,
        });

        expect(errorCode).toBe(1);
        expect(output).toContain("Unable to resolve project dependencies.");
      },
    );
  });
});
