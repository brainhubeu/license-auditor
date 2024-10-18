import * as path from "node:path";
import { parseLicenseFiles } from "./find-license-in-license-file";
import { findLicenseInPackageJson } from "./find-license-in-package-json";
import type { LicensesWithPath } from "./licenses-with-path";

export async function findLicenses(
  packageJson: object,
  packagePath: string
): Promise<LicensesWithPath> {
  const licenseFromPackageJson = findLicenseInPackageJson(packageJson);
  if (licenseFromPackageJson) {
    return {
      licenses: licenseFromPackageJson,
      licensePath: path.join(packagePath, "package.json"),
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
