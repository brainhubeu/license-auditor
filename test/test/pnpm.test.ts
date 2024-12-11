import * as path from "node:path";

import type { JsonResults } from "@license-auditor/data";
import { describe, expect } from "vitest";
import { pnpmFixture } from "../fixtures";
import { addPackage } from "../utils/add-package";
import { getCliPath } from "../utils/get-cli-path";
import { readJsonFile } from "../utils/read-json-file";
import { runCliCommand } from "../utils/run-cli-command";

describe("pnpm", () => {
  pnpmFixture("pnpm", async ({ testDirectory }) => {
    const { output, errorCode } = await runCliCommand({
      command: "npx",
      args: [getCliPath(), "--production"],
      cwd: testDirectory,
    });

    expect(errorCode).toBe(0);
    expect(output).toContain("88 licenses are compliant");
  });

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
        expect(output).toContain("247 licenses are compliant");

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
        expect(output).toContain("247 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-package@1.0.0",
        );

        expect(addedPackage?.licenses[0].source).toBe("package.json-licenses");
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
        expect(output).toContain("247 licenses are compliant");

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
        expect(output).toContain("247 licenses are compliant");

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
        expect(output).toContain("247 licenses are compliant");

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
        expect(output).toContain("247 licenses are compliant");

        const addedPackage = jsonOutput.whitelist.find(
          (result) => result.packageName === "test-package@1.0.0",
        );

        expect(addedPackage?.licenses[0].source).toBe("license-file-content");
      },
    );
  });
});
