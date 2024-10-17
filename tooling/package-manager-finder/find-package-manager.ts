import { execSync } from "node:child_process";
import { detect } from "detect-package-manager";

export async function findPackageManager(cwd?: string): Promise<string> {
  const packageManager = await detect({ cwd });

  if (packageManager === "yarn") {
    const version = execSync("yarn --version", { encoding: "utf8" }).trim();

    if (version.startsWith("1.")) {
      return "yarn-classic";
    }

    throw new Error(
      "Currently only Yarn Classic (version 1.x) is supported, not the modern versions.",
    );
  }

  return packageManager;
}
