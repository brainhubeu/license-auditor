import * as path from "node:path";
import type { JsonResults } from "@license-auditor/data";
import { describe, expect } from "vitest";
import { pnpmFixture } from "../fixtures";
import { addPackage } from "../utils/add-package";
import { getCliPath } from "../utils/get-cli-path";
import { readJsonFile } from "../utils/read-json-file";
import { runCliCommand } from "../utils/run-cli-command";

describe("pnpm", () => {
  pnpmFixture(
    "audits compliant packages correctly",
    async ({ testDirectory }) => {
      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--production"],
        cwd: testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("88 licenses are compliant");
    },
  );

  describe("verificationStatus", async () => {
    pnpmFixture(
      "'ok' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addPackage(
          testDirectory,
          "testing-license-file",
          {
            version: "1.0.0",
            license: "MIT",
          },
          [{ name: "LICENSE-MIT", content: "MIT" }],
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json"),
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("247 licenses are compliant");

        const okStatus = jsonOutput.whitelist.find(
          (result) => result.packageName === "testing-license-file@1.0.0",
        );

        expect(okStatus?.verificationStatus).toBe("ok");
      },
    );

    pnpmFixture(
      "'someButNotAllLicensesWhitelisted' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addPackage(testDirectory, "testing-license-file", {
          version: "1.0.0",
          license: "(MIT or BlueOak-1.0.0)",
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json"),
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("247 licenses are compliant");

        const someButNotAllLicensesWhitelisted =
          jsonOutput.needsUserVerification.find(
            (result) => result.packageName === "testing-license-file@1.0.0",
          );

        expect(someButNotAllLicensesWhitelisted?.verificationMessage).toContain(
          "Some but not all licenses are whitelisted for package",
        );
      },
    );

    pnpmFixture(
      "'licenseFilesExistButSomeAreUncertain' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addPackage(
          testDirectory,
          "testing-license-file",
          {
            version: "1.0.0",
            license: "MIT",
          },
          [
            { name: "LICENSE-MIT", content: "MIT" },
            { name: "LICENSE", content: "nonsense" },
          ],
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json"),
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("246 licenses are compliant");

        const someButNotAllLicensesWhitelisted =
          jsonOutput.needsUserVerification.find(
            (result) => result.packageName === "testing-license-file@1.0.0",
          );

        expect(someButNotAllLicensesWhitelisted?.verificationMessage).toContain(
          "We've found few license files",
        );
      },
    );

    pnpmFixture(
      "'licenseFileExistsButUnknownLicense' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addPackage(
          testDirectory,
          "testing-license-file",
          {
            version: "1.0.0",
            license: "MIT",
          },
          [{ name: "LICENSE", content: "nonsense" }],
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json"),
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("246 licenses are compliant");

        const licenseFileExistsButUnknownLicense =
          jsonOutput.needsUserVerification.find(
            (result) => result.packageName === "testing-license-file@1.0.0",
          );

        expect(
          licenseFileExistsButUnknownLicense?.verificationMessage,
        ).toContain("We’ve found a license file, but no matching licenses");
      },
    );

    pnpmFixture(
      "'licenseFileNotFound' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addPackage(testDirectory, "testing-license-file", {
          version: "1.0.0",
          license: "MIT",
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json"),
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("247 licenses are compliant");

        const licenseFileNotFound = jsonOutput.whitelist.find(
          (result) => result.packageName === "testing-license-file@1.0.0",
        );

        expect(licenseFileNotFound?.verificationStatus).toContain(
          "licenseFileNotFound",
        );
      },
    );
  });
});
