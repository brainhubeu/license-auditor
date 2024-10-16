import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export type SupportedPackageManager = "npm" | "pnpm" | "yarn-classic";

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function checkGlobalInstallation(
  pm: SupportedPackageManager,
): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`${pm} --version`);
    if (pm === "yarn-classic") {
      const version = stdout.trim();
      return version.startsWith("1.");
    }
    return true;
  } catch {
    return false;
  }
}

async function checkLockFiles(
  projectRoot: string,
): Promise<SupportedPackageManager | null> {
  const [hasNpmLock, hasYarnLock, hasPnpmLock] = await Promise.all([
    pathExists(path.join(projectRoot, "package-lock.json")),
    pathExists(path.join(projectRoot, "yarn.lock")),
    pathExists(path.join(projectRoot, "pnpm-lock.yaml")),
  ]);

  if (hasNpmLock) {
    return "npm";
  }
  if (hasYarnLock) {
    // Yarn classic doesn't have a package.json field
    const packageJson = await readPackageJson(projectRoot);
    if (!packageJson.packageManager) {
      return "yarn-classic";
    }
    throw new Error(
      "Other versions of Yarn other than Classic are not supported",
    );
  }
  if (hasPnpmLock) {
    return "pnpm";
  }

  return null;
}

async function readPackageJson(
  projectRoot: string,
): Promise<{ packageManager?: string }> {
  const packageJsonPath = path.join(projectRoot, "package.json");
  if (await pathExists(packageJsonPath)) {
    return JSON.parse(await fs.readFile(packageJsonPath, "utf-8")) as {
      packageManager?: string;
    };
  }
  return {};
}

async function checkPackageJsonHints(
  projectRoot: string,
): Promise<SupportedPackageManager | null> {
  const packageJson = await readPackageJson(projectRoot);
  if (packageJson.packageManager) {
    if (packageJson.packageManager.startsWith("npm@")) {
      return "npm";
    }
    if (packageJson.packageManager.startsWith("yarn@1")) {
      return "yarn-classic";
    }
    if (packageJson.packageManager.startsWith("pnpm@")) {
      return "pnpm";
    }
  }
  return null;
}

export async function findPackageManager(
  projectRoot: string,
): Promise<SupportedPackageManager> {
  const lockFileResult = await checkLockFiles(projectRoot);
  if (lockFileResult) {
    return lockFileResult;
  }

  const packageJsonResult = await checkPackageJsonHints(projectRoot);
  if (packageJsonResult) {
    return packageJsonResult;
  }

  const [hasGlobalNpm, hasGlobalYarn, hasGlobalPnpm] = await Promise.all([
    checkGlobalInstallation("npm"),
    checkGlobalInstallation("yarn-classic"),
    checkGlobalInstallation("pnpm"),
  ]);

  if (hasGlobalNpm) {
    return "npm";
  }
  if (hasGlobalYarn) {
    return "yarn-classic";
  }
  if (hasGlobalPnpm) {
    return "pnpm";
  }

  throw new Error("Incorrect project path or no package manager found");
}
