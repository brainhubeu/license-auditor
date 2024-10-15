import { SupportedPackageManager } from "../package-manager-finder/find-package-manager";
import { detectNpmDependencies } from "./npm";
import { detectPnpmDependencies } from "./pnpm";
import { detectYarnClassicDependencies } from "./yarn-classic";

export function findDependencies(
  packageManager: SupportedPackageManager,
  projectRoot: string
): string[] {
  switch (packageManager) {
    case "npm":
      return detectNpmDependencies(projectRoot);
    case "pnpm":
      return detectPnpmDependencies(projectRoot);
    case "yarn-classic":
      return detectYarnClassicDependencies(projectRoot);
    default:
      throw new Error("Unsupported package manager");
  }
}
