import { type LicenseStatus, checkLicenseStatus } from "./check-license-status";
import { extractPackageName, readPackageJson } from "./file-utils";
import { findLicense } from "./license-finder/find-license";

interface PackageInfo extends LicenseWithPath {
  package: string;
  path: string;
  status: LicenseStatus;
}

interface AuditSummary {
  allowed: number;
  disallowed: number;
  unknown: number;
}

interface LicenseAuditResult {
  resultMap: Map<string, PackageInfo>;
  summary: AuditSummary;
}

async function auditLicenses(
  packagePaths: string[],
): Promise<LicenseAuditResult> {
  const resultMap = new Map<string, PackageInfo>();
  const summary: AuditSummary = {
    allowed: 0,
    disallowed: 0,
    unknown: 0,
  };

  for (const packagePath of packagePaths) {
    const packageName = extractPackageName(packagePath);

    if (resultMap.has(packageName)) {
      break;
    }
    const packageJson = readPackageJson(packagePath);

    const { license, licensePath } = await findLicense(
      packageJson,
      packagePath,
    );

    const status = checkLicenseStatus(license);

    const packageInfo: PackageInfo = {
      package: packageName,
      path: packagePath,
      license: license,
      licensePath: licensePath,
      status: status,
    };

    resultMap.set(packageName, packageInfo);
    summary[status] += 1;
  }

  return {
    resultMap,
    summary,
  };
}
