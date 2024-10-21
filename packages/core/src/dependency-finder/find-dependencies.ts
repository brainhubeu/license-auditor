import type { SupportedPm } from "@license-auditor/package-manager-finder";
import { findInternalPackages } from "./find-internal-packages";
import { findNpmDependencies } from "./npm";
import { findPnpmDependencies } from "./pnpm";
import { findYarnClassicDependencies } from "./yarn-classic";

export async function findDependencies(
  packageManager: SupportedPm,
  projectRoot: string,
): Promise<string[]> {
  const [dependencies, internalPackages] = await Promise.all([
    findExternalDependencies(packageManager, projectRoot),
    findInternalPackages(projectRoot),
  ]);

  return dependencies.filter(
    (dep) => !internalPackages.some((internalPkg) => dep.endsWith(internalPkg)),
  );
}

function findExternalDependencies(
  packageManager: SupportedPm,
  projectRoot: string,
): Promise<string[]> {
  switch (packageManager) {
    case "npm":
      return findNpmDependencies(projectRoot);
    case "pnpm":
      return findPnpmDependencies(projectRoot);
    case "yarn-classic":
      return findYarnClassicDependencies(projectRoot);
    default:
      throw new Error("Unsupported package manager");
  }
}