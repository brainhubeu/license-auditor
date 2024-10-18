import type { SupportedPm } from "@license-auditor/package-manager-finder";
import { findInternalPackages } from "./find-internal-packages";
import { detectNpmDependencies } from "./npm";
import { detectPnpmDependencies } from "./pnpm";
import { detectYarnClassicDependencies } from "./yarn-classic";

export async function findDependencies(
  packageManager: SupportedPm,
  projectRoot: string,
): Promise<string[]> {
  const [dependencies, internalPackages] = await Promise.all([
    findExternalDependencies(packageManager, projectRoot),
    findInternalPackages(projectRoot),
  ]);

  return dependencies.filter(
    (dep) => !internalPackages.some((internalPkg) => dep.includes(internalPkg)),
  );
}

async function findExternalDependencies(
  packageManager: SupportedPm,
  projectRoot: string,
): Promise<string[]> {
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
