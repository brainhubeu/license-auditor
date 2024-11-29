import type {
  ConfigType,
  DetectedLicense,
  LicenseAuditResult,
} from "@license-auditor/data";
import type { LicenseStatus } from "./check-license-status.js";
import { findDependencies } from "./dependency-finder/find-dependencies.js";
import {
  extractPackageNameFromPath,
  extractPackageNameWithVersion,
  readPackageJson,
} from "./file-utils.js";
import { filterOverrides } from "./filter-overrides.js";
import { filterWithFilterRegex } from "./filter-with-filter-regex.js";
import { findPackageManager } from "./find-package-manager.js";
import { findLicenses } from "./license-finder/find-license.js";
import { parseVerificationStatusToMessage } from "./parse-verification-status-to-message.js";
import { resolveLicenseStatus } from "./resolve-license-status.js";

export async function auditLicenses(
  cwd: string,
  config: ConfigType,
  filterRegex?: string,
  production?: boolean | undefined,
): Promise<LicenseAuditResult> {
  const packageManager = await findPackageManager(cwd);
  const { dependencies: packagePaths, warning } = await findDependencies({
    packageManager,
    projectRoot: cwd,
    production,
  });

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

  const needsUserVerification = new Map<
    string,
    {
      packagePath: string;
      verificationMessage: string;
    }
  >();

  const foundPackages: Pick<DetectedLicense, "packageName" | "packagePath">[] =
    packagePaths.map((packagePath) => ({
      packagePath,
      packageName: extractPackageNameFromPath(packagePath),
    }));

  const filteredByRegex = filterWithFilterRegex({
    foundPackages,
    filterRegex,
  });

  const { filteredPackages, notFoundOverrides } = filterOverrides({
    foundPackages: filteredByRegex,
    overrides: config.overrides,
  });

  for (const {
    packageName: packageNameFromPath,
    packagePath,
  } of filteredPackages) {
    const packageJsonResult = readPackageJson(packagePath);
    if (!packageJsonResult.success) {
      notFound.set(packageNameFromPath, {
        packagePath,
        errorMessage: packageJsonResult.errorMessage,
      });
      continue;
    }

    const packageName =
      extractPackageNameWithVersion(packageJsonResult.packageJson) ??
      packageNameFromPath;
    if (
      resultMap.has(packageName) ||
      notFound.has(packageName) ||
      needsUserVerification.has(packageName)
    ) {
      continue;
    }

    const licensesWithPath = await findLicenses(
      packageJsonResult.packageJson,
      packagePath,
      config,
    );

    if (
      !licensesWithPath.licensePath ||
      licensesWithPath.verificationStatus === "licenseNotFound"
    ) {
      notFound.set(packageName, {
        packagePath,
        errorMessage: `License not found in ${packagePath}`,
      });
      continue;
    }

    if (licensesWithPath.verificationStatus !== "ok") {
      needsUserVerification.set(packageName, {
        packagePath,
        verificationMessage: parseVerificationStatusToMessage(
          licensesWithPath.verificationStatus,
          packageName,
          packagePath,
        ),
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
      verificationStatus: licensesWithPath.verificationStatus,
    };

    groupedByStatus[status].push(detectedLicense);
    resultMap.set(packageName, detectedLicense);
  }

  return {
    groupedByStatus,
    notFound,
    overrides: {
      notFoundOverrides,
    },
    needsUserVerification,
    warning,
  };
}
