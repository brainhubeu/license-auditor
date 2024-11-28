import { type PM, detect, getNpmVersion } from "detect-package-manager";

export type SupportedPm = Omit<PM, "bun"> | "yarn-classic";

export async function findPackageManager(cwd?: string): Promise<SupportedPm> {
  const packageManager = await detect({ cwd });

  if (packageManager === "yarn") {
    const version = await getNpmVersion(packageManager);

    if (version.startsWith("1.")) {
      return "yarn-classic";
    }

    return "yarn";
  }

  if (packageManager === "bun") {
    throw new Error("Bun is not supported yet");
  }

  return packageManager;
}
