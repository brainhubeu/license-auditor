import type {
  ConfigType,
  DetectedLicense,
  LicenseAuditResult,
} from "@license-auditor/data";
import { findPackageManager } from "@license-auditor/package-manager-finder";
import {
  type LicenseStatus,
  checkLicenseStatus,
} from "./check-license-status.js";
import { findDependencies } from "./dependency-finder/find-dependencies.js";
import { extractPackageName, readPackageJson } from "./file-utils.js";
import { filterOverrides } from "./filter-overrides.js";
import { findLicenseById } from "./license-finder/find-license-by-id.js";
import { findLicenses } from "./license-finder/find-license.js";
import { resolveLicenseStatus } from "./resolve-license-status.js";

export async function auditLicenses(
  cwd: string,
  config: ConfigType,
): Promise<LicenseAuditResult> {
  const packageManager = await findPackageManager(cwd);
  const packagePaths = await findDependencies(packageManager, cwd);

  const resultMap = new Map<string, DetectedLicense>();
  const groupedByStatus: Record<LicenseStatus, DetectedLicense[]> = {
    whitelist: [],
    blacklist: [],
    unknown: [],
  };

  const notFound = new Map<
    string,
    { packagePath: string; errorMessage: string }
  >();

  const foundPackages: Pick<DetectedLicense, "packageName" | "packagePath">[] =
    packagePaths.map((packagePath) => ({
      packagePath,
      packageName: extractPackageName(packagePath),
    }));

  const { excluded, assigned, filteredPackages, extraOverrides } =
    filterOverrides({
      foundPackages,
      overrides: config.overrides,
    });

  for (const [assignedPackageName, assignedLicense] of Object.entries(
    assigned,
  )) {
    const license = findLicenseById(assignedLicense)[0];

    if (license) {
      const status = checkLicenseStatus(license, config);
      groupedByStatus[status].push({
        packageName: assignedPackageName,
        packagePath: "",
        licenses: [license],
        status: status,
        licenseExpression: "",
        needsVerification: false,
        licensePath: "",
      });
    }
  }

  for (const { packageName, packagePath } of filteredPackages) {
    if (resultMap.has(packageName) || notFound.has(packageName)) {
      continue;
    }

    const packageJsonResult = readPackageJson(packagePath);
    if (!packageJsonResult.success) {
      notFound.set(packageName, {
        packagePath: packagePath,
        errorMessage: packageJsonResult.errorMessage,
      });
      continue;
    }

    const licensesWithPath = await findLicenses(
      packageJsonResult.packageJson,
      packagePath,
    );

    if (!licensesWithPath.licensePath) {
      notFound.set(packageName, {
        packagePath,
        errorMessage: `License not found in ${packagePath}`,
      });
      continue;
    }

    if (
      licensesWithPath.licenses.length === 0 &&
      licensesWithPath.needsVerification
    ) {
      notFound.set(packageName, {
        packagePath,
        errorMessage: `We’ve found a license file, but no matching licenses in it ${licensesWithPath.licensePath}. Please review package ${packageName} and assign a matching license or skip the check by listing it in the overrides field of the config file`,
      });
      continue;
    }

    const status = resolveLicenseStatus(licensesWithPath, config);

    const detectedLicense: DetectedLicense = {
      packageName,
      packagePath,
      status,
      licenses: licensesWithPath.licenses,
      licenseExpression: licensesWithPath.licenseExpression,
      licensePath: licensesWithPath.licensePath,
      needsVerification: licensesWithPath.needsVerification,
    };

    groupedByStatus[status].push(detectedLicense);
    resultMap.set(packageName, detectedLicense);
  }

  console.log(
    "Result:",
    Array.from(resultMap.entries()).map(
      ([key, value]) =>
        `${key}: ${value.licenses.map((v) => v.licenseId).join(", ")}`,
    ),
  );
  return {
    groupedByStatus,
    notFound,
    overrides: {
      excluded,
      assigned,
      extraOverrides,
    },
  };
}
