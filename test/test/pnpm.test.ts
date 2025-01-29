import * as path from "node:path";

import * as fs from "node:fs/promises";
import type { JsonResults } from "@license-auditor/data";
import { describe, expect } from "vitest";
import { pnpmFixture } from "../fixtures";
import { addPackage } from "../utils/add-package";
import { addToPackageJson } from "../utils/add-to-package-json";
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
        expect(output).toContain("245 licenses are compliant");

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
        expect(output).toContain("245 licenses are compliant");

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
        expect(output).toContain("244 licenses are compliant");

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
        expect(output).toContain("244 licenses are compliant");

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
        expect(output).toContain("245 licenses are compliant");
        const licenseFileNotFound = jsonOutput.whitelist.find(
          (result) => result.packageName === "testing-license-file@1.0.0",
        );

        expect(licenseFileNotFound?.verificationStatus).toContain(
          "licenseFileNotFound",
        );
      },
    );

    describe("source", () => {
      pnpmFixture(
        "correctly resolves to 'package.json-license'",
        async ({ testDirectory }) => {
          await addPackage(testDirectory, "test-package", {
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
          expect(output).toContain("245 licenses are compliant");
          const addedPackage = jsonOutput.whitelist.find(
            (result) => result.packageName === "test-package@1.0.0",
          );

          expect(addedPackage?.licenses[0].source).toBe("package.json-license");
        },
      );

      pnpmFixture(
        "correctly resolves to 'package.json-licenses'",
        async ({ testDirectory }) => {
          await addPackage(testDirectory, "test-package", {
            version: "1.0.0",
            licenses: "MIT",
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
          expect(output).toContain("245 licenses are compliant");

          const addedPackage = jsonOutput.whitelist.find(
            (result) => result.packageName === "test-package@1.0.0",
          );

          expect(addedPackage?.licenses[0].source).toBe(
            "package.json-licenses",
          );
        },
      );

      pnpmFixture(
        "correctly resolves to 'package.json-legacy'",
        async ({ testDirectory }) => {
          await addPackage(testDirectory, "test-package", {
            version: "1.0.0",
            licenses: ["MIT"],
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
          expect(output).toContain("245 licenses are compliant");

          const addedPackage = jsonOutput.whitelist.find(
            (result) => result.packageName === "test-package@1.0.0",
          );

          expect(addedPackage?.licenses[0].source).toBe("package.json-legacy");
        },
      );

      pnpmFixture(
        "correctly resolves to 'package.json-license-expression'",
        async ({ testDirectory }) => {
          await addPackage(testDirectory, "test-package", {
            version: "1.0.0",
            license: "(MIT or ISC)",
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
          expect(output).toContain("245 licenses are compliant");

          const addedPackage = jsonOutput.whitelist.find(
            (result) => result.packageName === "test-package@1.0.0",
          );

          expect(addedPackage?.licenses[0].source).toBe(
            "package.json-license-expression",
          );
        },
      );

      pnpmFixture(
        "correctly resolves to 'license-file-content-keywords'",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "test-package",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE", content: "MIT" }],
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
          expect(output).toContain("245 licenses are compliant");

          const addedPackage = jsonOutput.whitelist.find(
            (result) => result.packageName === "test-package@1.0.0",
          );

          expect(addedPackage?.licenses[0].source).toBe(
            "license-file-content-keywords",
          );
        },
      );

      pnpmFixture(
        "correctly resolves to 'license-file-content'",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "test-package",
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
          expect(output).toContain("245 licenses are compliant");

          const addedPackage = jsonOutput.whitelist.find(
            (result) => result.packageName === "test-package@1.0.0",
          );

          expect(addedPackage?.licenses[0].source).toBe("license-file-content");
        },
      );
    });

    describe("--production flag", () => {
      pnpmFixture(
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
            path.join(testDirectory, "license-auditor.results.json"),
          );

          expect(errorCode).toBe(0);
          expect(output).toContain("89 licenses are compliant");

          const addedPackage = jsonOutput.whitelist.find(
            (result) => result.packageName === "test-dep@1.0.0",
          );

          expect(addedPackage).toBeDefined();
        },
      );

      pnpmFixture("omits devDependencies", async ({ testDirectory }) => {
        await addToPackageJson(
          testDirectory,
          "test-dep",
          {
            version: "1.0.0",
            license: "MIT",
          },
          [],
          true,
        );

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--json", "--production"],
          cwd: testDirectory,
        });

        const jsonOutput: JsonResults = await readJsonFile(
          path.join(testDirectory, "license-auditor.results.json"),
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("88 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-dep@1.0.0",
        );

        expect(addedPackage).toBeUndefined();
      });
    });
  });

  describe("error-handling", () => {
    pnpmFixture(
      "Error message when configuration file is invalid",
      async ({ testDirectory }) => {
        const invalidConfig = `
      		const config = {
      		  blacklist: "this-should-be-an-array",
      		  whitelist: 12345,
      		  overrides: "this-should-be-an-object",
      		};
      		export default config;
      	  `;
        const configFilePath = path.resolve(
          testDirectory,
          "license-auditor.config.ts",
        );
        await fs.writeFile(configFilePath, invalidConfig);

        const { output, errorCode } = await runCliCommand(
          {
            command: "npx",
            args: [getCliPath()],
            cwd: testDirectory,
          },
          { cols: 200 },
        );

        expect(output).toContain("Invalid configuration file at");
        expect(output).toContain(
          'Invalid value in path: blacklist - error "invalid_type". Expected array, received string',
        );
        expect(output).toContain(
          'Invalid value in path: whitelist - error "invalid_type". Expected array, received number',
        );
        expect(output).toContain(
          'Invalid value in path: overrides - error "invalid_type". Expected object, received string',
        );
      },
    );

    pnpmFixture(
      "Errors include a library without package.json",
      async ({ testDirectory }) => {
        const packageDirectory = path.resolve(
          testDirectory,
          "node_modules",
          "a-library-without-package-json",
        );
        await fs.mkdir(packageDirectory, { recursive: true });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath(), "--verbose"],
          cwd: testDirectory,
        });

        expect(output).toContain("1 package returned error:");
        expect(output).toContain("package.json not found for package at");
      },
    );
  });
});
