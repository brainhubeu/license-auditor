import type { License } from "@license-auditor/licenses";
import { findPackageManager } from "@license-auditor/package-manager-finder";
import {
  type AuditSummary,
  type LicenseStatus,
  checkLicenseStatus,
  tempConfig,
} from "./check-license-status";
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

interface LicenseAuditResult {
  resultMap: Map<string, PackageInfo>;
  summary: AuditSummary;
  notFound: Set<string>;
}

async function auditLicenses(
  projectRoot: string,
  includeInternalPackages = false,
): Promise<LicenseAuditResult> {
  const packageManager = await findPackageManager(projectRoot);
  const packagePaths = await findDependencies(
    packageManager,
    projectRoot,
    includeInternalPackages,
  );

  const resultMap = new Map<string, PackageInfo>();
  const summary: AuditSummary = {
    whitelist: 0,
    blacklist: 0,
    unknown: 0,
  };
  const notFound = new Set<string>();

  for (const packagePath of packagePaths) {
    const packageName = extractPackageName(packagePath);

    if (resultMap.has(packageName) || notFound.has(packageName)) {
      break;
    }
    const packageJson = readPackageJson(packagePath);

    const licensesWithPath = findLicenses(packageJson, packagePath);

    if (!licensesWithPath.licensePath) {
      console.warn(`No license found in ${packagePath}`);
      notFound.add(packageName);
      continue;
    }

    const licensesWithStatus = [];
    for (const license of licensesWithPath.licenses) {
      const status = checkLicenseStatus(license, tempConfig);
      summary[status] += 1;
      licensesWithStatus.push({
        ...license,
        status,
      });
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

  return {
    resultMap,
    summary,
    notFound,
  };
}
