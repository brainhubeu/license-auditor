import { describe, expect } from "vitest";
import { addPackage } from "../utils/add-package";
import { getCliPath } from "../utils/get-cli-path";
import { runCliCommand } from "../utils/run-cli-command";

import * as path from "node:path";
import type { JsonResults } from "@license-auditor/data";
import {
  conflictingPeerDepsTest,
  defaultTest,
  legacyPeerDepsTest,
} from "../fixtures";
import { addToPackageJson } from "../utils/add-to-package-json";
import { getLicenseContent } from "../utils/get-license-content";
import {
  getBlacklistedLicenses,
  getNeedsUserVerificationLicenses,
  getNotFoundLicenses,
  getUnknownLicenses,
  getWhitelistedLicenses,
} from "../utils/json-output-utils";
import { readJsonFile } from "../utils/read-json-file";

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
        expect(output).toContain("245 licenses are compliant");
        expect(output).toContain("2 packages are requiring manual checking");
      }
    );

    defaultTest(
      "detects non-compliant packages correctly",
      async ({ testDirectory }) => {
        await addPackage(testDirectory, "testing-blueoak-package", {
          version: "1.0.0",
          license: "BlueOak-1.0.0",
        });

        const { output, errorCode } = await runCliCommand({
          command: "npx",
          args: [getCliPath()],
          cwd: testDirectory,
        });

        expect(errorCode).toBe(0);
        expect(output).toContain("245 licenses are compliant");
        expect(output).toContain("1 license is unknown");
        expect(output).toContain("2 packages are requiring manual checking");
      }
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
      }
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
            "testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }]
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--json"],
            cwd: testDirectory,
          });

          const jsonOutput = await readJsonFile(
            path.join(testDirectory, "license-auditor.results.json")
          );

          expect(errorCode).toBe(0);
          expect(output).toContain("246 licenses are compliant");

          expect(
            getWhitelistedLicenses(
              jsonOutput,
              ["testing-license-file"],
              ["MIT"]
            ).length
          ).toBe(1);
          expect(
            getBlacklistedLicenses(
              jsonOutput,
              ["testing-license-file"],
              ["MIT"]
            ).length
          ).toBe(0);
          expect(
            getUnknownLicenses(jsonOutput, ["testing-license-file"]).length
          ).toBe(0);
        }
      );

      defaultTest(
        "one correct license file and one incorrect license file",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [
              { name: "LICENSE-MIT", content: "MIT" },
              { name: "LICENSE-WRONG", content: "WRONG" },
            ]
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--verbose", "--json"],
            cwd: testDirectory,
          });

          const jsonOutput = await readJsonFile(
            path.join(testDirectory, "license-auditor.results.json")
          );

          expect(errorCode).toBe(0);
          expect(output).toContain("3 packages are requiring manual checking");

          expect(
            getNeedsUserVerificationLicenses(jsonOutput, [
              "testing-license-file",
            ])
          ).toContainEqual(
            expect.objectContaining({
              packageName: "testing-license-file@1.0.0",
              verificationMessage: expect.stringMatching(
                /We've found few license files, but we could not match a license for some of them for package/
              ),
            })
          );
        }
      );

      defaultTest(
        "single license file with incorrect license",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-WRONG", content: "WRONG" }]
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--verbose", "--json"],
            cwd: testDirectory,
          });

          const jsonOutput = await readJsonFile(
            path.join(testDirectory, "license-auditor.results.json")
          );

          expect(errorCode).toBe(0);
          expect(output).toContain("1 package is missing license information");
          expect(output).toContain("2 packages are requiring manual checking");
          expect(output).toContain(
            "We’ve found a license file, but no matching licenses in"
          );

          expect(
            getNotFoundLicenses(jsonOutput, ["testing-license-file"])
          ).toContainEqual(
            expect.objectContaining({
              packageName: "testing-license-file@1.0.0",
              errorMessage: expect.stringMatching(
                /License not found in package.json and in license file in/
              ),
            })
          );
        }
      );

      defaultTest(
        "two license files with correct licenses",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [
              { name: "LICENSE-MIT", content: await getLicenseContent("MIT") },
              { name: "LICENSE-ISC", content: await getLicenseContent("ISC") },
            ]
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--verbose", "--json"],
            cwd: testDirectory,
          });

          const jsonOutput = await readJsonFile(
            path.join(testDirectory, "license-auditor.results.json")
          );

          expect(errorCode).toBe(0);
          expect(output).toContain("246 licenses are compliant");
          expect(output).toContain("2 packages are requiring manual checking");

          expect(
            getWhitelistedLicenses(jsonOutput, ["testing-license-file"])
          ).toContainEqual(
            expect.objectContaining({
              packageName: "testing-license-file@1.0.0",
              licenses: expect.arrayContaining([
                expect.objectContaining({
                  licenseId: "MIT",
                }),
                expect.objectContaining({
                  licenseId: "ISC",
                }),
              ]),
            })
          );
        }
      );

      defaultTest(
        "two license files, one correct and one not whitelisted",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "testing-license-file",
            {
              version: "1.0.0",
              license: "",
            },
            [
              { name: "LICENSE-MIT", content: await getLicenseContent("MIT") },
              {
                name: "LICENSE-GPL",
                content: await getLicenseContent("GPL-3.0-or-later"),
              },
            ]
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--verbose", "--json"],
            cwd: testDirectory,
          });

          const jsonOutput = await readJsonFile(
            path.join(testDirectory, "license-auditor.results.json")
          );

          expect(errorCode).toBe(0);
          expect(output).toContain("3 packages are requiring manual checking");
          expect(output).toContain(
            "Some but not all licenses are whitelisted for package"
          );

          expect(
            getNeedsUserVerificationLicenses(jsonOutput, [
              "testing-license-file",
            ])
          ).toContainEqual(
            expect.objectContaining({
              packageName: "testing-license-file@1.0.0",
              verificationMessage: expect.stringMatching(
                /Some but not all licenses are whitelisted for package/
              ),
            })
          );
          expect(
            getBlacklistedLicenses(jsonOutput, ["testing-license-file"])
          ).toContainEqual(
            expect.objectContaining({
              packageName: "testing-license-file@1.0.0",
              licenses: expect.arrayContaining([
                expect.objectContaining({
                  licenseId: "MIT",
                }),
                expect.objectContaining({
                  licenseId: "GPL-3.0-or-later",
                }),
              ]),
            })
          );
        }
      );

      defaultTest(
        "displays not found licenses in verbose table",
        async ({ testDirectory }) => {
          await addPackage(testDirectory, "testing-no-license", {
            version: "1.0.0",
            license: "",
          });

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--verbose", "--json"],
            cwd: testDirectory,
          });

          const jsonOutput = await readJsonFile(
            path.join(testDirectory, "license-auditor.results.json")
          );

          expect(errorCode).toBe(0);
          expect(output).toContain("1 package is missing license information");

          expect(
            getNotFoundLicenses(jsonOutput, ["testing-no-license"])
          ).toContainEqual(
            expect.objectContaining({
              packageName: "testing-no-license@1.0.0",
              errorMessage: expect.stringMatching(
                /License not found in package.json and in license file/
              ),
            })
          );
        }
      );
    });
    describe("filter-regex flag", () => {
      defaultTest(
        "one package should be filtered with filter-regex flag",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "mismatch@testing-lib/lib1",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }]
          );

          await addPackage(
            testDirectory,
            "mismatchlib-test",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }]
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--filter-regex", "@testing-lib"],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("246 licenses are compliant");
        }
      );

      defaultTest(
        "two packages with same organization name should be filtered with filter-regex flag",
        async ({ testDirectory }) => {
          await addPackage(
            testDirectory,
            "mismatch@testing-lib/lib1",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }]
          );

          await addPackage(
            testDirectory,
            "mismatch@testing-lib/lib2",
            {
              version: "1.0.0",
              license: "",
            },
            [{ name: "LICENSE-MIT", content: "MIT" }]
          );

          const { output, errorCode } = await runCliCommand({
            command: "npx",
            args: [getCliPath(), "--filter-regex", "@testing-lib"],
            cwd: testDirectory,
          });

          expect(errorCode).toBe(0);
          expect(output).toContain("245 licenses are compliant");
        }
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

        expect(errorCode).toBe(0);
        expect(output).toContain("Unable to resolve project dependencies.");
      }
    );
  });

  describe("source", () => {
    defaultTest(
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
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("246 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-package@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe("package.json-license");
      }
    );

    defaultTest(
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
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("246 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-package@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe("package.json-licenses");
      }
    );

    defaultTest(
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
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("246 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-package@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe("package.json-legacy");
      }
    );

    defaultTest(
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
          path.join(testDirectory, "license-auditor.results.json")
        );

        expect(errorCode).toBe(0);
        expect(output).toContain("246 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-package@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe(
          "package.json-license-expression"
        );
      }
    );

    defaultTest(
      "correctly resolves to 'license-file-content-keywords'",
      async ({ testDirectory }) => {
        await addPackage(
          testDirectory,
          "test-package",
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
        expect(output).toContain("246 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-package@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe(
          "license-file-content-keywords"
        );
      }
    );

    defaultTest(
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
        expect(output).toContain("246 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-package@1.0.0"
        );

        expect(addedPackage?.licenses[0].source).toBe("license-file-content");
      }
    );
  });

  describe("--production flag", () => {
    defaultTest(
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
        expect(output).toContain("78 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-dep@1.0.0"
        );

        expect(addedPackage).toBeDefined();
      }
    );

    defaultTest("omits devDependencies", async ({ testDirectory }) => {
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
      expect(output).toContain("77 licenses are compliant");

      const addedPackage = jsonOutput.whitelist.find(
        (result) => result.packageName === "test-dep@1.0.0"
      );

      expect(addedPackage).toBeUndefined();
    });
  });
});
