import fs from "node:fs";
import { type PM, detect, getNpmVersion } from "detect-package-manager";
import { UnsupportedPackageManagerException } from "./exceptions/unsupported-package-manager.exception.js";

export type SupportedPm = Omit<PM, "bun"> | "yarn-classic";

export async function findPackageManager(cwd: string): Promise<SupportedPm> {
  const packageManager = await detect({ cwd });

  if (packageManager === "yarn") {
    const version = await getNpmVersion(packageManager);

    if (fs.existsSync(`${cwd}/.pnp.cjs`)) {
      throw new UnsupportedPackageManagerException(
        `Yarn Plung'n'Play is currently not supported.`,
      );
    }

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
