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

  const { excluded, assigned, filteredPackagePaths } = filterOverrides({
    packagePaths,
    overrides: config.overrides,
  });

  if (Object.keys(assigned).length > 0) {
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
    // Object.entries(assigned).forEach(
    //   ([assignedPackageName, assignedLicense]) => {
    //     const license = findLicenseById(assignedLicense)[0];

    //     if (license) {
    //       const status = checkLicenseStatus(license, config);
    //       groupedByStatus[status].push({
    //         packageName: assignedPackageName,
    //         packagePath: "",
    //         licenses: [license],
    //         status: status,
    //         licenseExpression: "",
    //         needsVerification: false,
    //         licensePath: "",
    //       });
    //     }
    //   },
    // );
  }

  for (const packagePath of filteredPackagePaths) {
    const packageName = extractPackageName(packagePath);

    if (resultMap.has(packageName) || notFound.has(packageName)) {
      continue;
    }

    const packageJsonResult = readPackageJson(packagePath);
    if (!packageJsonResult.success) {
      notFound.set(packageName, {
        packagePath,
        errorMessage: packageJsonResult.errorMessage,
      });
      continue;
    }
    // todo: handle needsVerification case when license path exists but no licenses have been found

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

  // console.log(
  //   "Result:",
  //   Array.from(resultMap.entries()).map(
  //     ([key, value]) =>
  //       `${key}: ${value.licenses.map((v) => v.licenseId).join(", ")}`
  //   )
  // );
  return {
    groupedByStatus,
    notFound,
    excluded,
    assigned,
  };
}
