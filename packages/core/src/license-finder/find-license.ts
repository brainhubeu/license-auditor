import * as path from "node:path";
import type { PackageJsonType } from "../file-utils.js";
import { parseLicenseFiles } from "./find-license-in-license-file.js";
import { findLicenseInPackageJson } from "./find-license-in-package-json.js";
import type { LicensesWithPathAndStatus } from "./licenses-with-path.js";

export async function findLicenses(
  packageJson: PackageJsonType,
  packagePath: string,
): Promise<LicensesWithPathAndStatus> {
  const packageJsonPath = path.join(packagePath, "package.json");

  const licensesFromPackageJson = findLicenseInPackageJson(
    packageJson,
    packageJsonPath,
  );

  const licensesFromPackageJsonWithPath = {
    ...licensesFromPackageJson,
    licensePath: [packageJsonPath],
  };

  const licensesFromLicenseFile = await parseLicenseFiles(packagePath);

  const mergedLicenses: LicensesWithPathAndStatus = {
    licenses: [
      ...licensesFromPackageJsonWithPath.licenses,
      ...licensesFromLicenseFile.licenses,
    ],
    licensePath: [
      ...licensesFromPackageJsonWithPath.licensePath,
      ...licensesFromLicenseFile.licensePath,
    ],
    ...(licensesFromPackageJsonWithPath.licenseExpression
      ? {
          licenseExpression: licensesFromPackageJsonWithPath.licenseExpression,
          licenseExpressionParsed:
            licensesFromPackageJsonWithPath.licenseExpressionParsed,
        }
      : {}),
    verificationStatus: licensesFromLicenseFile.verificationStatus,
  };

  return mergedLicenses;
}
