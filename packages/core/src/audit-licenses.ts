import type { License } from "@license-auditor/licenses";
import { findPackageManager } from "@license-auditor/package-manager-finder";
import {
  type AuditSummary,
  type LicenseStatus,
  checkLicenseStatus,
  tempConfig,
} from "./check-license-status";
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
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
}

export async function auditLicenses(wd: string): Promise<LicenseAuditResult> {
  const packageManager = await findPackageManager(wd);
  console.log("Package Manager:", packageManager);

  const packagePaths: string[] = [];
  const resultMap = new Map<string, PackageInfo>();
  const summary: AuditSummary = {
    whitelist: 0,
    blacklist: 0,
    unknown: 0,
  };

  const notFound = new Map<
    string,
    { packagePath: string; errorMessage: string }
  >();

  for (const packagePath of packagePaths) {
    const packageName = extractPackageName(packagePath);

    if (resultMap.has(packageName) || notFound.has(packageName)) {
      break;
    }
    const packageJsonResult = readPackageJson(packagePath);

    if (packageJsonResult.errorMessage) {
      notFound.set(packageName, {
        packagePath,
        errorMessage: packageJsonResult.errorMessage,
      });
      continue;
    }

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
  }

  return {
    resultMap,
    summary,
    notFound,
  };
}

// hardcoded for testing
// todo: pass actual project root path from cli
const auditResult = auditLicenses(".");

// console.log("Result Map:", auditResult.resultMap);
// console.log(
//   "Licenses:",
//   Array.from(auditResult.resultMap.values()).flatMap((p) => p.result.licenses),
// );
// console.log("Summary:", auditResult.summary);
// console.log("Not found:", auditResult.notFound);
