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
import { findLicenses } from "./license-finder/find-license.js";

export async function auditLicenses(
  cwd: string,
  config: ConfigType,
): Promise<LicenseAuditResult> {
  const packageManager = await findPackageManager(cwd);
  const packagePaths = await findDependencies(packageManager, cwd);

  const resultMap = new Map<string, DetectedLicense[]>();
  const groupedByStatus: Record<LicenseStatus, DetectedLicense[]> = {
    whitelist: [],
    blacklist: [],
    unknown: [],
  };

  const notFound = new Map<
    string,
    { packagePath: string; errorMessage: string }
  >();

  for (const packagePath of packagePaths) {
    const packageName = extractPackageName(packagePath);

    if (resultMap.has(packageName) || notFound.has(packageName)) {
      console.log("Skipping package:", packageName);
      continue;
    }
    const packageJsonResult = readPackageJson(packagePath);

    if (packageJsonResult.errorMessage) {
      notFound.set(packageName, {
        packagePath,
        errorMessage: packageJsonResult.errorMessage,
      });
      continue;
    }
    // todo: handle needsVerification case when license path exists but no licenses have been found

    if (packageJsonResult.packageJson) {
      const licensesWithPath = await findLicenses(
        packageJsonResult.packageJson,
        packagePath,
      );

      if (!licensesWithPath.licensePath) {
        const errorMsg = `No license found in ${packagePath}`;
        console.warn(errorMsg);
        notFound.set(packageName, { packagePath, errorMessage: errorMsg });
        continue;
      }
      const detectedLicenses: DetectedLicense[] = [];
      for (const license of licensesWithPath.licenses) {
        const status = checkLicenseStatus(license, config);
        const detectedLicense = {
          packageName,
          packagePath,
          license: {
            ...license,
            status,
          },
          licensePath: licensesWithPath.licensePath,
        };
        groupedByStatus[status].push(detectedLicense);
        detectedLicenses.push(detectedLicense);
      }
      resultMap.set(packageName, detectedLicenses);
    }
  }

  console.log(
    "Result:",
    Array.from(resultMap.entries()).map(
      ([key, value]) =>
        `${key}: ${value.map((v) => v.license.licenseId).join(", ")}`,
    ),
  );
  return {
    groupedByStatus,
    notFound,
  };
}
