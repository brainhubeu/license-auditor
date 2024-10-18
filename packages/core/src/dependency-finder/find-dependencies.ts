import type { SupportedPm } from "@license-auditor/package-manager-finder";
import { detectNpmDependencies } from "./npm";
import { detectPnpmDependencies } from "./pnpm";
import { detectYarnClassicDependencies } from "./yarn-classic";

export async function findDependencies(
  packageManager: SupportedPm,
  projectRoot: string,
): Promise<string[]> {
  switch (packageManager) {
    case "npm":
      return await detectNpmDependencies(projectRoot);
    case "pnpm":
      return await detectPnpmDependencies(projectRoot);
    case "yarn-classic":
      return await detectYarnClassicDependencies(projectRoot);
    default:
      throw new Error("Unsupported package manager");
  }
}
