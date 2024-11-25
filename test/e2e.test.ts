import { describe, expect } from "vitest";
import { addPackage } from "./utils/add-package";
import { getCliPath } from "./utils/get-cli-path";
import { runCliCommand } from "./utils/run-cli-command";

import { defaultTest, legacyPeerDepsTest } from "./fixtures";

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
				expect(output).toContain("2 licenses are blacklisted");
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
				"parse license files: single license file with correct license",
				async ({ testDirectory }) => {
					await addPackage(
						testDirectory,
						"node_modules/testing-license-file",
						{
							version: "1.0.0",
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
				"parse license files: one correct license file and one incorrect license file",
				async ({ testDirectory }) => {
					await addPackage(
						testDirectory,
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
				"parse license files: single license file with incorrect license",
				async ({ testDirectory }) => {
					await addPackage(
						testDirectory,
						"node_modules/testing-license-file",
						{
							version: "1.0.0",
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
				"parse license files: two license files with correct licenses",
				async ({ testDirectory }) => {
					await addPackage(
						testDirectory,
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
						cwd: testDirectory,
					});

					expect(errorCode).toBe(0);
					expect(output).toContain("247 licenses are compliant");
				},
			);

			defaultTest(
				"parse license files: two license files, one correct and one not whitelisted",
				async ({ testDirectory }) => {
					await addPackage(
						testDirectory,
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
						cwd: testDirectory,
					});

					expect(errorCode).toBe(0);
					expect(output).toContain("1 package is requiring manual checking");
					expect(output).toContain("Not all licenses are whitelisted");
				},
			);
		});
	});
});
