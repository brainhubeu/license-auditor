import type { ConfigType } from "@license-auditor/config";
import type { License } from "@license-auditor/licenses";
import { findPackageManager } from "@license-auditor/package-manager-finder";
import { type LicenseStatus, checkLicenseStatus } from "./check-license-status";
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
  notFound: Set<string>;
}

export async function auditLicenses(
  wd: string,
  config: ConfigType,
): Promise<LicenseAuditResult> {
  const packageManager = await findPackageManager(wd);
  console.log("Package Manager:", packageManager);

  const packagePaths: string[] = [];

  const resultMap = new Map<string, PackageInfo>();
  const groupedByStatus: Record<LicenseStatus, LicenseInfo[]> = {
    whitelist: [],
    blacklist: [],
    unknown: [],
  };
  const notFound = new Set<string>();

  for (const packagePath of packagePaths) {
    const packageName = extractPackageName(packagePath);

    if (resultMap.has(packageName) || notFound.has(packageName)) {
      console.log("Skipping package:", packageName);
      continue;
    }
    const packageJson = readPackageJson(packagePath);

    const licensesWithPath = findLicenses(packageJson, packagePath);

    if (!licensesWithPath.licensePath) {
      console.warn(`No license found in ${packagePath}`);
      notFound.add(packageName);
      continue;
    }
    // todo: handle needsVerification case when license path exists but no licenses have been found

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

    const packageInfo: PackageInfo = {
      package: packageName,
      path: packagePath,
      result: {
        licenses: licensesWithStatus,
        licensePath: licensesWithPath.licensePath,
      },
    };

    resultMap.set(packageName, packageInfo);
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
