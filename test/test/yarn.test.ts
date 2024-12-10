import * as path from "node:path";
import type { JsonResults } from "@license-auditor/data";
import { describe, expect } from "vitest";
import { yarnFixture } from "../fixtures";
import { addPackage } from "../utils/add-package";
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
    },
  );

  // describe("verificationStatus", () => {
  //   yarnFixture(
  //     "'ok' status is evaluated correctly",
  //     async ({ testDirectory }) => {
  //       await addPackage(
  //         testDirectory,
  //         "testing-license-file",
  //         {
  //           version: "1.0.0",
  //           license: "MIT",
  //         },
  //         [{ name: "LICENSE-MIT", content: "MIT" }],
  //       );

  //       const { output, errorCode } = await runCliCommand({
  //         command: "npx",
  //         args: [getCliPath(), "--json"],
  //         cwd: testDirectory,
  //       });

  //       const jsonOutput: JsonResults = await readJsonFile(
  //         path.join(testDirectory, "license-auditor.results.json"),
  //       );

  //       expect(errorCode).toBe(0);
  //       expect(output).toContain("159 licenses are compliant");

  //       const okStatus = jsonOutput.whitelist.filter(
  //         (result) => result.verificationStatus === "ok",
  //       );

  //       expect(okStatus.length).toBe(240);
  //     },
  //   );

  //   yarnFixture(
  //     "'someButNotAllLicensesWhitelisted' status is evaluated correctly",
  //     async ({ testDirectory }) => {
  //       console.log({ testDirectory });
  //       await addPackage(testDirectory, "testing-license-file", {
  //         version: "1.0.0",
  //         license: "(MIT or BlueOak-1.0.0)",
  //       });

  //       const { output, errorCode } = await runCliCommand({
  //         command: "npx",
  //         args: [getCliPath(), "--json"],
  //         cwd: testDirectory,
  //       });

  //       const jsonOutput: JsonResults = await readJsonFile(
  //         path.join(testDirectory, "license-auditor.results.json"),
  //       );

  //       expect(errorCode).toBe(0);
  //       expect(output).toContain("246 licenses are compliant");

  //       const someButNotAllLicensesWhitelisted =
  //         jsonOutput.needsUserVerification.filter((result) =>
  //           result.verificationMessage.startsWith(
  //             "Some but not all licenses are whitelisted for package",
  //           ),
  //         );

  //       expect(someButNotAllLicensesWhitelisted.length).toBe(1);
  //     },
  //   );

  //   yarnFixture(
  //     "'licenseFilesExistButSomeAreUncertain' status is evaluated correctly",
  //     async ({ testDirectory }) => {
  //       await addPackage(
  //         testDirectory,
  //         "testing-license-file",
  //         {
  //           version: "1.0.0",
  //           license: "MIT",
  //         },
  //         [
  //           { name: "LICENSE-MIT", content: "MIT" },
  //           { name: "LICENSE", content: "nonsense" },
  //         ],
  //       );

  //       const { output, errorCode } = await runCliCommand({
  //         command: "npx",
  //         args: [getCliPath(), "--json"],
  //         cwd: testDirectory,
  //       });

  //       const jsonOutput: JsonResults = await readJsonFile(
  //         path.join(testDirectory, "license-auditor.results.json"),
  //       );

  //       expect(errorCode).toBe(0);
  //       expect(output).toContain("159 licenses are compliant");

  //       const someButNotAllLicensesWhitelisted =
  //         jsonOutput.needsUserVerification.filter((result) =>
  //           result.verificationMessage.startsWith(
  //             "We've found few license files",
  //           ),
  //         );

  //       expect(someButNotAllLicensesWhitelisted.length).toBe(1);
  //     },
  //   );

  //   yarnFixture(
  //     "'licenseFileExistsButUnknownLicense' status is evaluated correctly",
  //     async ({ testDirectory }) => {
  //       await addPackage(
  //         testDirectory,
  //         "testing-license-file",
  //         {
  //           version: "1.0.0",
  //           license: "MIT",
  //         },
  //         [{ name: "LICENSE", content: "nonsense" }],
  //       );

  //       const { output, errorCode } = await runCliCommand({
  //         command: "npx",
  //         args: [getCliPath(), "--json"],
  //         cwd: testDirectory,
  //       });

  //       const jsonOutput: JsonResults = await readJsonFile(
  //         path.join(testDirectory, "license-auditor.results.json"),
  //       );

  //       expect(errorCode).toBe(0);
  //       expect(output).toContain("159 licenses are compliant");

  //       const licenseFileExistsButUnknownLicense =
  //         jsonOutput.needsUserVerification.filter((result) =>
  //           result.verificationMessage.startsWith(
  //             "We’ve found a license file, but no matching licenses",
  //           ),
  //         );

  //       expect(licenseFileExistsButUnknownLicense.length).toBe(3);
  //     },
  //   );

  //   yarnFixture(
  //     "'licenseFileNotFound' status is evaluated correctly",
  //     async ({ testDirectory }) => {
  //       await addPackage(testDirectory, "testing-license-file", {
  //         version: "1.0.0",
  //         license: "",
  //       });

  //       const { output, errorCode } = await runCliCommand({
  //         command: "npx",
  //         args: [getCliPath(), "--json"],
  //         cwd: testDirectory,
  //       });

  //       const jsonOutput: JsonResults = await readJsonFile(
  //         path.join(testDirectory, "license-auditor.results.json"),
  //       );

  //       expect(errorCode).toBe(0);
  //       expect(output).toContain("159 licenses are compliant");

  //       const licenseFileNotFound = jsonOutput.notFound.length;

  //       expect(licenseFileNotFound).toBe(1);
  //     },
  //   );
  // });
});
