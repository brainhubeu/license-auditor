import { exec } from "node:child_process";
import { promisify } from "node:util";
import { type PM, detect } from "detect-package-manager";

const execAsync = promisify(exec);

export type SupportedPm = Omit<PM, "bun" | "yarn"> | "yarn-classic";

export async function findPackageManager(cwd?: string): Promise<SupportedPm> {
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

  if (packageManager === "bun") {
    throw new Error("Bun is not supported yet");
  }

  return packageManager;
}
