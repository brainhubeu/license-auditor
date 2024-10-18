import { type PM, detect, getNpmVersion } from "detect-package-manager";

export type SupportedPm = Omit<PM, "bun" | "yarn"> | "yarn-classic";

export async function findPackageManager(cwd?: string): Promise<SupportedPm> {
  const packageManager = await detect({ cwd });

  if (packageManager === "yarn") {
    const version = await getNpmVersion(packageManager);

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
