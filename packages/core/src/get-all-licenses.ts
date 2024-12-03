import type { ConfigType, DetectedLicense } from "@license-auditor/data";
import { findDependencies } from "./dependency-finder/find-dependencies.js";
import {
  extractPackageNameFromPath,
  extractPackageNameWithVersion,
  readPackageJson,
} from "./file-utils.js";
import { filterOverrides } from "./filter-overrides.js";
import { findPackageManager } from "./find-package-manager.js";
import { findLicenses } from "./license-finder/find-license.js";
import type { LicensesWithPathAndStatus } from "./license-finder/licenses-with-path.js";

export interface LicenseAuditResult2 {
  overrides: {
    notFoundOverrides: string[];
  };
  licenses: Map<
    string,
    {
      packagePath: string;
      packageName: string;
      licensesWithPath: LicensesWithPathAndStatus;
    }
  >;
  warning?: string | undefined;
}

export async function getAllLicenses(
  cwd: string,
  config: ConfigType,
  production?: boolean | undefined,
): Promise<LicenseAuditResult2> {
  const packageManager = await findPackageManager(cwd);
  const { dependencies: packagePaths, warning } = await findDependencies({
    packageManager,
    projectRoot: cwd,
    production,
  });

  const resultMap = new Map<
    string,
    {
      packagePath: string;
      packageName: string;
      licensesWithPath: LicensesWithPathAndStatus;
    }
  >();

  const foundPackages: Pick<DetectedLicense, "packageName" | "packagePath">[] =
    packagePaths.map((packagePath) => ({
      packagePath,
      packageName: extractPackageNameFromPath(packagePath),
    }));

  const { filteredPackages, notFoundOverrides } = filterOverrides({
    foundPackages,
    overrides: config.overrides,
  });

  for (const {
    packageName: packageNameFromPath,
    packagePath,
  } of filteredPackages) {
    const packageJsonResult = readPackageJson(packagePath);

    //TODO handle this
    if (!packageJsonResult.success) {
      continue;
    }

    const packageName =
      extractPackageNameWithVersion(packageJsonResult.packageJson) ??
      packageNameFromPath;
    if (resultMap.has(packageName)) {
      continue;
    }

    const licensesWithPath = await findLicenses(
      packageJsonResult.packageJson,
      packagePath,
    );

    const packageWithLicense = {
      packagePath,
      packageName,
      licensesWithPath,
    };

    resultMap.set(packageName, packageWithLicense);
  }

  return {
    overrides: {
      notFoundOverrides,
    },
    licenses: resultMap,
    warning,
  };
}
