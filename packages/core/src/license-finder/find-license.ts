import * as path from "node:path";
import type { PackageJsonType } from "../file-utils.js";
import { parseLicenseFiles } from "./find-license-in-license-file.js";
import { findLicenseInPackageJson } from "./find-license-in-package-json.js";
import type { LicensesWithPath } from "./licenses-with-path.js";

export async function findLicenses(
  packageJson: PackageJsonType,
  packagePath: string,
): Promise<LicensesWithPath> {
  const packageJsonPath = path.join(packagePath, "package.json");

  const licenseFromPackageJson = findLicenseInPackageJson(packageJson);
  if (licenseFromPackageJson.length > 0) {
    return {
      licenses: licenseFromPackageJson,
      licensePath: packageJsonPath,
    };
  }

  const licenseFromLicenseFile = await parseLicenseFiles(packagePath);
  if (licenseFromLicenseFile) {
    return licenseFromLicenseFile;
  }

  return {
    licenses: [],
    licensePath: undefined,
  };
}
