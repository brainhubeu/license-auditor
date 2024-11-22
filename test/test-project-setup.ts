import * as fs from "node:fs/promises";
import * as path from "node:path";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { execAsync } from "./utils/exec-async";

export type TestContext = {
  testDirectory: string;
};

beforeAll(async () => {
  await fs.copyFile(
    path.resolve(
      __dirname,
      "../packages/cli/public/template/default/license-auditor.config.ts",
    ),
    path.resolve(__dirname, "testProject", "license-auditor.config.ts"),
  );

  await execAsync("npm i", { cwd: path.resolve(__dirname, "testProject") });

  await fs.mkdir(path.resolve(__dirname, "temp"), { recursive: true });
});

beforeEach(async (context: TestContext) => {
  const testDirectory = path.resolve(
    __dirname,
    "temp",
    `testProject-${Math.random().toString(36).substring(2)}`,
  );
  await fs.cp(path.resolve(__dirname, "testProject"), testDirectory, {
    recursive: true,
  });
  context.testDirectory = testDirectory;
});

afterEach(async (context: TestContext) => {
  await fs.rm(context.testDirectory, { recursive: true, force: true });
});

afterAll(async () => {
  await fs.rm(path.resolve(__dirname, "temp"), {
    recursive: true,
    force: true,
  });
  await fs.rm(path.resolve(__dirname, "testProject", "node_modules"), {
    recursive: true,
    force: true,
  });
  await fs.rm(
    path.resolve(__dirname, "testProject", "license-auditor.config.ts"),
    { force: true },
  );
});
