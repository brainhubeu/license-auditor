import { exec } from "node:child_process";
import { promisify } from "node:util";
import { detect } from "detect-package-manager";

const execAsync = promisify(exec);

export async function findPackageManager(cwd?: string): Promise<string> {
  const packageManager = await detect({ cwd });

  if (packageManager === "yarn") {
    const version = await execAsync("yarn --version", {
      encoding: "utf8",
    }).then((result) => result.stdout.trim());

    if (version.startsWith("1.")) {
      return "yarn-classic";
    }

    throw new Error(
      "Currently only Yarn Classic (version 1.x) is supported, not the modern versions.",
    );
  }

  return packageManager;
}
