import type {
  ConfigType,
  DetectedLicense,
  LicenseAuditResult,
  VerificationStatus,
} from "@license-auditor/data";
import { findPackageManager } from "@license-auditor/package-manager-finder";
import type { LicenseStatus } from "./check-license-status.js";
import { findDependencies } from "./dependency-finder/find-dependencies.js";
import { extractPackageName, readPackageJson } from "./file-utils.js";
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

  const needsUserVerification = new Map<
    string,
    {
      packagePath: string;
      status: VerificationStatus;
    }
  >();

  for (const packagePath of packagePaths) {
    const packageName = extractPackageName(packagePath);

    if (
      resultMap.has(packageName) ||
      notFound.has(packageName) ||
      needsUserVerification.has(packageName)
    ) {
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

    if (licensesWithPath.verificationStatus !== "ok") {
      needsUserVerification.set(packageName, {
        packagePath,
        status: licensesWithPath.verificationStatus,
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

  console.log(
    "Result:",
    Array.from(resultMap.entries()).map(
      ([key, value]) =>
        `${key}: ${value.licenses.map((v) => v.licenseId).join(", ")}`,
    ),
  );
  return {
    groupedByStatus,
    notFound,
    needsUserVerification,
  };
}
