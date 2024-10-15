import fs from "fs";
import path from "path";

export type SupportedPackageManager = "npm" | "pnpm" | "yarn-classic";

export function findPackageManager(
  projectRoot: string
): SupportedPackageManager {
  if (fs.existsSync(path.join(projectRoot, "package-lock.json"))) {
    return "npm";
  }

  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8")
    ) as { packageManager?: string };

    // Yarn Classic doesn't have a 'packageManager' field in package.json
    if (!packageJson.packageManager) {
      return "yarn-classic";
    }

    throw new Error(
      "Other versions of Yarn other than Classic are not supported"
    );
  }

  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  // If no lock file is found, check package.json for hints
  if (fs.existsSync(path.join(projectRoot, "package.json"))) {
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectRoot, "package.json"), "utf-8")
    ) as { packageManager?: string };

    if (packageJson.packageManager) {
      if (packageJson.packageManager.startsWith("npm@")) {
        return "npm";
      } else if (packageJson.packageManager.startsWith("yarn@1")) {
        return "yarn-classic";
      } else if (packageJson.packageManager.startsWith("pnpm@")) {
        return "pnpm";
      }
    }
  }

  throw new Error("Incorrect project path or no package manager found");
}
