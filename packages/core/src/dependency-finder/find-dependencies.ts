import type { DependenciesResult } from "@license-auditor/data";
import { UnsupportedPackageManagerException } from "../exceptions/unsupported-package-manager.exception.js";
import type { SupportedPm } from "../find-package-manager.js";
import { findInternalPackages } from "./find-internal-packages.js";
import { findNpmDependencies } from "./npm.js";
import { findPnpmDependencies } from "./pnpm.js";
import { findYarnClassicDependencies } from "./yarn-classic.js";

export async function findDependencies({
  packageManager,
  projectRoot,
  production,
}: {
  packageManager: SupportedPm;
  projectRoot: string;
  production?: boolean | undefined;
}): Promise<DependenciesResult> {
  const [{ dependencies: dependencyPaths, warning }, internalPackages] =
    await Promise.all([
      findExternalDependencies({ packageManager, projectRoot, production }),
      findInternalPackages(projectRoot),
    ]);

  const dependencies = dependencyPaths.filter(
    (dep) => !internalPackages.some((internalPkg) => dep.endsWith(internalPkg)),
  );

  if (warning) {
    return { dependencies, warning };
  }
  return { dependencies };
}

function findExternalDependencies({
  packageManager,
  projectRoot,
  production,
}: {
  packageManager: SupportedPm;
  projectRoot: string;
  production?: boolean | undefined;
}): Promise<DependenciesResult> {
  switch (packageManager) {
    case "npm":
      return findNpmDependencies(projectRoot, production);
    case "pnpm":
      return findPnpmDependencies(projectRoot, production);
    case "yarn-classic":
      return findYarnClassicDependencies(projectRoot, production);
    default:
      throw new UnsupportedPackageManagerException(
        "Unsupported package manager",
      );
  }
}
