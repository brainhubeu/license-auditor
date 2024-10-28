import * as path from "node:path";
import { parseLicenseFiles } from "./find-license-in-license-file.ts";
import { findLicenseInPackageJson } from "./find-license-in-package-json.ts";
import type { LicensesWithPath } from "./licenses-with-path.ts";
import type { PackageJsonType } from "../file-utils.ts";

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
