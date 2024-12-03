import * as fs from "node:fs/promises";
import * as path from "node:path";
import { test } from "vitest";
import {
  TEST_PROJECTS_DIRECTORY,
  TEST_TEMP_DIRECTORY,
  type TestContext,
} from "./test-project-setup";

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

export const pnpmFixture = test.extend<TestContext>({
  // biome-ignore lint/correctness/noEmptyPattern: destructuring pattern is required in fixture
  testDirectory: async ({}, use) => {
    const testDirectory = path.resolve(
      TEST_TEMP_DIRECTORY,
      `testProject-${Math.random().toString(36).substring(2)}`,
    );
    await fs.cp(path.resolve(TEST_PROJECTS_DIRECTORY, "pnpm"), testDirectory, {
      recursive: true,
    });

    await use(testDirectory);

    await fs.rm(testDirectory, { recursive: true });
  },
});
