import type {
  ConfigType,
  DetectedLicense,
  License,
  LicenseAuditResult,
} from "@brainhubeu/license-auditor-data";
import { findPackageManager } from "@brainhubeu/package-manager-finder";
import {
  type LicenseStatus,
  checkLicenseStatus,
} from "./check-license-status.js";
import { findDependencies } from "./dependency-finder/find-dependencies.js";
import { extractPackageName, readPackageJson } from "./file-utils.js";
import { findLicenses } from "./license-finder/find-license.js";
import type { LicensesWithPath } from "./license-finder/licenses-with-path.js";

interface PackageInfo {
  package: string;
  path: string;
  result: LicensesWithPath & {
    licenses: (License & { status: LicenseStatus })[];
  };
}

export async function auditLicenses(
  cwd: string,
  config: ConfigType,
): Promise<LicenseAuditResult> {
  const packageManager = await findPackageManager(cwd);
  const packagePaths = await findDependencies(packageManager, cwd);

  const resultMap = new Map<string, PackageInfo>();
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
      for (const license of licensesWithPath.licenses) {
        const status = checkLicenseStatus(license, config);
        const licenseWithStatus = {
          ...license,
          status,
        };
        groupedByStatus[status].push({
          package: packageName,
          path: packagePath,
          license: licenseWithStatus,
          licensePath: licensesWithPath.licensePath,
        });
      }
    }
  }

  console.log(
    "Result:",
    Array.from(resultMap.values()).map(
      (p) =>
        `${p.package}: ${p.result.licenses.map((l) => l.licenseId).join(", ")}`,
    ),
  );
  return {
    groupedByStatus,
    notFound,
  };
}
