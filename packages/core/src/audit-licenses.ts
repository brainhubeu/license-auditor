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
  notFound: Set<string>;
}

export async function auditLicenses(wd: string): Promise<LicenseAuditResult> {
  const packageManager = await findPackageManager(wd);
  console.log("Package Manager:", packageManager);

  // adjust paths to run locally
  const packagePaths: string[] = [
    "/Users/filipkublin/Documents/license-auditor/packages/core/samples/@mergeapi/merge-node-client",
    "/Users/filipkublin/Documents/license-auditor/packages/core/samples/@rudderstack/rudder-sdk-node",
    "/Users/filipkublin/Documents/license-auditor/packages/core/samples/@zilliz/milvus2-sdk-node",
  ];
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

    const licensesWithPath = await findLicenses(packageJson, packagePath);

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
