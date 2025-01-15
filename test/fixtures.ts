import * as fs from "node:fs/promises";
import * as path from "node:path";
import { test } from "vitest";
import {
  TEST_PROJECTS_DIRECTORY,
  TEST_TEMP_DIRECTORY,
  type TestContext,
} from "./global-setup";

export const defaultTest = test.extend<TestContext>({
  // biome-ignore lint/correctness/noEmptyPattern: destructuring pattern is required in fixture
  testDirectory: async ({}, use) => {
    const testDirectory = path.resolve(
      TEST_TEMP_DIRECTORY,
      `testProject-${Math.random().toString(36).substring(2)}`,
    );
    await fs.cp(
      path.resolve(TEST_PROJECTS_DIRECTORY, "default"),
      testDirectory,
      {
        recursive: true,
        verbatimSymlinks: true,
      },
    );

    await use(testDirectory);

    await fs.rm(testDirectory, { recursive: true });
  },
});
export const legacyPeerDepsTest = test.extend<TestContext>({
  // biome-ignore lint/correctness/noEmptyPattern: destructuring pattern is required in fixture
  testDirectory: async ({}, use) => {
    const testDirectory = path.resolve(
      TEST_TEMP_DIRECTORY,
      `testProject-${Math.random().toString(36).substring(2)}`,
    );
    await fs.cp(
      path.resolve(TEST_PROJECTS_DIRECTORY, "legacyPeerDeps"),
      testDirectory,
      {
        recursive: true,
      },
    );

    await use(testDirectory);

    await fs.rm(testDirectory, { recursive: true });
  },
});

export const conflictingPeerDepsTest = test.extend<TestContext>({
  // biome-ignore lint/correctness/noEmptyPattern: destructuring pattern is required in fixture
  testDirectory: async ({}, use) => {
    const testDirectory = path.resolve(
      TEST_TEMP_DIRECTORY,
      `testProject-${Math.random().toString(36).substring(2)}`,
    );

    await fs.cp(
      path.resolve(TEST_PROJECTS_DIRECTORY, "conflictingPeerDeps"),
      testDirectory,
      {
        recursive: true,
      },
    );

    await use(testDirectory);

    await fs.rm(testDirectory, { recursive: true });
  },
});

export const testErrorHandling = test.extend<TestContext>({
  // biome-ignore lint/correctness/noEmptyPattern: destructuring pattern is required in fixture
  testDirectory: async ({}, use) => {
    const testDirectory = path.resolve(
      TEST_TEMP_DIRECTORY,
      `testProject-${Math.random().toString(36).substring(2)}`,
    );

    await fs.cp(
      path.resolve(TEST_PROJECTS_DIRECTORY, "testErrorHandling"),
      testDirectory,
      {
        recursive: true,
      },
    );

    await use(testDirectory);

    await fs.rm(testDirectory, { recursive: true });
  },
});

export const pnpmFixture = test.extend<TestContext>({
  // biome-ignore lint/correctness/noEmptyPattern: destructuring pattern is required in fixture
  testDirectory: async ({}, use) => {
    const testDirectory = path.resolve(
      TEST_TEMP_DIRECTORY,
      `testProject-${Math.random().toString(36).substring(2)}`,
    );
    await fs.cp(path.resolve(TEST_PROJECTS_DIRECTORY, "pnpm"), testDirectory, {
      recursive: true,
      verbatimSymlinks: true,
    });

    const packageManagers = ["7.30.0", "8.6.0", "9.14.4"];
    for (const packageManager of packageManagers) {
      const packageJsonPath = path.join(testDirectory, "package.json");
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8"),
      );
      packageJson.packageManager = `pnpm@${packageManager}`;
      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8",
      );

      await use(testDirectory);
    }

    await fs.rm(testDirectory, { recursive: true });
  },
});

export const yarnFixture = test.extend<TestContext>({
  // biome-ignore lint/correctness/noEmptyPattern: destructuring pattern is required in fixture
  testDirectory: async ({}, use) => {
    const testDirectory = path.resolve(
      TEST_TEMP_DIRECTORY,
      `testProject-${Math.random().toString(36).substring(2)}`,
    );
    await fs.cp(path.resolve(TEST_PROJECTS_DIRECTORY, "yarn"), testDirectory, {
      recursive: true,
    });

    const packageManagers = ["1.22.22", "3.8.7"];
    for (const packageManager of packageManagers) {
      const packageJsonPath = path.join(testDirectory, "package.json");
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf8"),
      );
      packageJson.packageManager = `yarn@${packageManager}`;
      await fs.writeFile(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        "utf8",
      );

      await use(testDirectory);
    }

    await fs.rm(testDirectory, { recursive: true });
  },
});

export const monorepoFixture = test.extend<TestContext>({
  // biome-ignore lint/correctness/noEmptyPattern: destructuring pattern is required in fixture
  testDirectory: async ({}, use) => {
    const testDirectory = path.resolve(
      TEST_TEMP_DIRECTORY,
      `testProject-${Math.random().toString(36).substring(2)}`,
    );
    await fs.cp(
      path.resolve(TEST_PROJECTS_DIRECTORY, "monorepo"),
      testDirectory,
      {
        recursive: true,
        verbatimSymlinks: true,
      },
    );

    await use(testDirectory);

    await fs.rm(testDirectory, { recursive: true });
  },
});
