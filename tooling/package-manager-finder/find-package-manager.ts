import { type PM, detect, getNpmVersion } from "detect-package-manager";

export type SupportedPm = Omit<PM, "bun" | "yarn"> | "yarn-classic";

import { UnsupportedPackageManagerException } from "@brainhubeu/license-auditor-core";

export async function findPackageManager(cwd?: string): Promise<SupportedPm> {
  const packageManager = await detect({ cwd });

  if (packageManager === "yarn") {
    const version = await getNpmVersion(packageManager);

    if (version.startsWith("1.")) {
      return "yarn-classic";
    }

    throw new UnsupportedPackageManagerException(
      "Currently only Yarn Classic (version 1.x) is supported, not the modern versions.",
    );
  }

  if (packageManager === "bun") {
    throw new UnsupportedPackageManagerException("Bun is not supported yet");
  }

  return packageManager;
}
