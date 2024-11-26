import * as fs from "node:fs/promises";
import * as path from "node:path";
import { afterAll, beforeAll } from "vitest";
import { execAsync } from "./utils/exec-async";

export type TestContext = {
  testDirectory: string;
};

export const TEST_PROJECTS_DIRECTORY = path.resolve(
  __dirname,
  "./testProjects",
);
export const TEST_TEMP_DIRECTORY = path.resolve(__dirname, "./temp");

const prepareTestProject = async (projectDirectory: string) => {
  await fs.copyFile(
    path.resolve(
      __dirname,
      "../packages/cli/public/template/default/license-auditor.config.ts",
    ),
    path.resolve(projectDirectory, "license-auditor.config.ts"),
  );

  await execAsync("npm i", { cwd: projectDirectory });
};
const cleanUpTestProjects = async (projectDirectory: string) => {
  await fs.rm(path.resolve(projectDirectory, "node_modules"), {
    recursive: true,
    force: true,
  });
  await fs.rm(path.resolve(projectDirectory, "license-auditor.config.ts"), {
    force: true,
  });
};

beforeAll(async () => {
  const results = await fs.readdir(TEST_PROJECTS_DIRECTORY, {
    withFileTypes: true,
  });
  for (const result of results) {
    if (result.isDirectory()) {
      await prepareTestProject(
        path.resolve(TEST_PROJECTS_DIRECTORY, result.name),
      );
    }
  }

  await fs.mkdir(path.resolve(__dirname, "temp"), { recursive: true });
});

afterAll(async () => {
  const results = await fs.readdir(TEST_PROJECTS_DIRECTORY, {
    withFileTypes: true,
  });
  for (const result of results) {
    if (result.isDirectory()) {
      await cleanUpTestProjects(
        path.resolve(TEST_PROJECTS_DIRECTORY, result.name),
      );
    }
  }
  await fs.rm(path.resolve(__dirname, "temp"), {
    recursive: true,
    force: true,
  });
});
