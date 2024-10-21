import type { ConfigType } from "@license-auditor/config";
import type { License } from "@license-auditor/licenses";
import { findPackageManager } from "@license-auditor/package-manager-finder";
import { type LicenseStatus, checkLicenseStatus } from "./check-license-status";
import { findDependencies } from "./dependency-finder/find-dependencies";
import { extractPackageName, readPackageJson } from "./file-utils";
import { findLicenses } from "./license-finder/find-license";

interface PackageInfo {
  package: string;
  path: string;
  result: {
    licenses: (License & { status: LicenseStatus })[];
    licensePath: string | undefined;
  };
}

interface LicenseInfo {
  package: string;
  path: string;
  license: License & { status: LicenseStatus };
  licensePath: string | undefined;
}

interface LicenseAuditResult {
  groupedByStatus: Record<LicenseStatus, LicenseInfo[]>;
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
}

export async function auditLicenses(
  cwd: string,
  config: ConfigType,
): Promise<LicenseAuditResult> {
  const packageManager = await findPackageManager(cwd);
  const packagePaths = await findDependencies(packageManager, cwd);

  const resultMap = new Map<string, PackageInfo>();
  const groupedByStatus: Record<LicenseStatus, LicenseInfo[]> = {
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
      const licensesWithPath = findLicenses(
        packageJsonResult.packageJson,
        packagePath,
      );

      if (!licensesWithPath.licensePath) {
        const errorMsg = `No license found in ${packagePath}`;
        console.warn(errorMsg);
        notFound.set(packageName, { packagePath, errorMessage: errorMsg });
        continue;
      }
      const licensesWithStatus = [];
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

        licensesWithStatus.push(licenseWithStatus);
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
