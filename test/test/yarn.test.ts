import * as path from "node:path";
import type { JsonResults } from "@license-auditor/data";
import { describe, expect } from "vitest";
import { yarnFixture } from "../fixtures";
import { addToPackageJson } from "../utils/add-to-package-json";
import { getCliPath } from "../utils/get-cli-path";
import { readJsonFile } from "../utils/read-json-file";
import { runCliCommand } from "../utils/run-cli-command";

describe("yarn", () => {
  yarnFixture(
    "audits compliant packages correctly",
    async ({ testDirectory }) => {
      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--production"],
        cwd: testDirectory,
      });

      expect(errorCode).toBe(0);
      expect(output).toContain("66 licenses are compliant");
    }
  );

  describe("verificationStatus", () => {
    yarnFixture(
      "'ok' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addToPackageJson(
          testDirectory,
          "test-dep",
          {
            version: "1.0.0",
            license: "MIT",
          },
          [{ name: "LICENSE-MIT", content: "MIT" }]
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("160 licenses are compliant");

        const okStatus = jsonOutput.whitelist.filter(
          (result) => result.verificationStatus === "ok"
        );

        expect(okStatus.length).toBe(158);
      }
    );

    yarnFixture(
      "'someButNotAllLicensesWhitelisted' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addToPackageJson(testDirectory, "test-dep", {
          version: "1.0.0",
          license: "(MIT or BlueOak-1.0.0)",
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("160 licenses are compliant");

        const someButNotAllLicensesWhitelisted =
          jsonOutput.needsUserVerification.filter((result) =>
            result.verificationMessage.startsWith(
              "Some but not all licenses are whitelisted for package"
            )
          );

        expect(someButNotAllLicensesWhitelisted.length).toBe(1);
      }
    );

    yarnFixture(
      "'licenseFilesExistButSomeAreUncertain' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addToPackageJson(
          testDirectory,
          "test-dep",
          {
            version: "1.0.0",
            license: "MIT",
          },
          [
            { name: "LICENSE-MIT", content: "MIT" },
            { name: "LICENSE", content: "nonsense" },
          ]
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("159 licenses are compliant");

        const someButNotAllLicensesWhitelisted =
          jsonOutput.needsUserVerification.filter((result) =>
            result.verificationMessage.startsWith(
              "We've found few license files"
            )
          );

        expect(someButNotAllLicensesWhitelisted.length).toBe(1);
      }
    );

    yarnFixture(
      "'licenseFileExistsButUnknownLicense' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addToPackageJson(
          testDirectory,
          "test-dep",
          {
            version: "1.0.0",
            license: "MIT",
          },
          [{ name: "LICENSE", content: "nonsense" }]
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("159 licenses are compliant");

        const licenseFileExistsButUnknownLicense =
          jsonOutput.needsUserVerification.filter((result) =>
            result.verificationMessage.startsWith(
              "We’ve found a license file, but no matching licenses"
            )
          );

        expect(licenseFileExistsButUnknownLicense.length).toBe(1);
      }
    );

    yarnFixture(
      "'licenseFileNotFound' status is evaluated correctly",
      async ({ testDirectory }) => {
        await addToPackageJson(testDirectory, "test-dep", {
          version: "1.0.0",
          license: "",
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("159 licenses are compliant");

        const licenseFileNotFound = jsonOutput.notFound.length;

        expect(licenseFileNotFound).toBe(1);
      }
    );
  });
  describe("source", () => {
    yarnFixture(
      "correctly resolves to 'package.json-license'",
      async ({ testDirectory }) => {
        await addToPackageJson(testDirectory, "test-dep", {
          version: "1.0.0",
          license: "MIT",
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("160 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-dep@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe("package.json-license");
      }
    );

    yarnFixture(
      "correctly resolves to 'package.json-licenses'",
      async ({ testDirectory }) => {
        await addToPackageJson(testDirectory, "test-dep", {
          version: "1.0.0",
          licenses: "MIT",
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("160 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-dep@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe("package.json-licenses");
      }
    );

    yarnFixture(
      "correctly resolves to 'package.json-legacy'",
      async ({ testDirectory }) => {
        await addToPackageJson(testDirectory, "test-dep", {
          version: "1.0.0",
          licenses: ["MIT"],
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("160 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-dep@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe("package.json-legacy");
      }
    );

    yarnFixture(
      "correctly resolves to 'package.json-license-expression'",
      async ({ testDirectory }) => {
        await addToPackageJson(testDirectory, "test-dep", {
          version: "1.0.0",
          license: "(MIT or ISC)",
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json", "--verbose"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("160 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-dep@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe(
          "package.json-license-expression"
        );
      }
    );

    yarnFixture(
      "correctly resolves to 'license-file-content-keywords'",
      async ({ testDirectory }) => {
        await addToPackageJson(
          testDirectory,
          "test-dep",
          {
            version: "1.0.0",
            license: "",
          },
          [{ name: "LICENSE", content: "MIT" }]
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("160 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-dep@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe(
          "license-file-content-keywords"
        );
      }
    );

    yarnFixture(
      "correctly resolves to 'license-file-content'",
      async ({ testDirectory }) => {
        await addToPackageJson(
          testDirectory,
          "test-dep",
          {
            version: "1.0.0",
            license: "",
          },
          [
            {
              name: "LICENSE",
              content:
                'MIT License\n\nCopyright (c) <year> <copyright holders>\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n',
            },
          ]
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("160 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-dep@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe("license-file-content");
      }
    );
  });

  describe("--production flag", () => {
    yarnFixture(
      "includes only production dependencies",
      async ({ testDirectory }) => {
        await addToPackageJson(testDirectory, "test-dep", {
          version: "1.0.0",
          license: "MIT",
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json", "--production"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("67 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-dep@1.0.0"
        );

        expect(addedPackage).toBeDefined();
      }
    );

    yarnFixture("omits devDependencies", async ({ testDirectory }) => {
      await addToPackageJson(
        testDirectory,
        "test-dep",
        {
          version: "1.0.0",
          license: "MIT",
        },
        [],
        true
      );

      const { output, errorCode } = await runCliCommand({
        command: "npx",
        args: [getCliPath(), "--json", "--production"],
        cwd: testDirectory,
      });

      const jsonOutput: JsonResults = await readJsonFile(
        path.join(testDirectory, "license-auditor.results.json")
      );

      expect(errorCode).toBe(0);
      expect(output).toContain("66 licenses are compliant");

      const addedPackage = jsonOutput.whitelist.find(
        (result) => result.packageName === "test-dep@1.0.0"
      );

      expect(addedPackage).toBeUndefined();
    });
  });
});
