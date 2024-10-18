import type { SupportedPm } from "@license-auditor/package-manager-finder";
import { findInternalPackages } from "./find-internal-packages";
import { detectNpmDependencies } from "./npm";
import { detectPnpmDependencies } from "./pnpm";
import { detectYarnClassicDependencies } from "./yarn-classic";

export async function findDependencies(
  packageManager: SupportedPm,
  projectRoot: string,
  includeInternalPackages = false,
): Promise<string[]> {
  let dependencies: string[];

  switch (packageManager) {
    case "npm":
      dependencies = await detectNpmDependencies(projectRoot);
      break;
    case "pnpm":
      dependencies = await detectPnpmDependencies(projectRoot);
      break;
    case "yarn-classic":
      dependencies = await detectYarnClassicDependencies(projectRoot);
      break;
    default:
      throw new Error("Unsupported package manager");
  }

  if (!includeInternalPackages) {
    const internalPackages = await findInternalPackages(projectRoot);
    return dependencies.filter(
      (dep) =>
        !internalPackages.some((internalPkg) => dep.includes(internalPkg)),
    );
  }

  return dependencies;
}
