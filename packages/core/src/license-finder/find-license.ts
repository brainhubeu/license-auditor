import * as path from "node:path";

import type { PackageJsonType } from "../schemas";
import { findLicenseInLicenseFile } from "./find-license-in-license-file";
import { findLicenseInPackageJson } from "./find-license-in-package-json";
import type { LicensesWithPath } from "./licenses-with-path";

export function findLicenses(
  packageJson: PackageJsonType,
  packagePath: string,
): LicensesWithPath {
  const packageJsonPath = path.join(packagePath, "package.json");

  const licenseFromPackageJson = findLicenseInPackageJson(packageJson);
  if (licenseFromPackageJson) {
    return {
      licenses: licenseFromPackageJson,
      licensePath: packageJsonPath,
    };
  }

  const licenseFromLicenseFile = findLicenseInLicenseFile();
  if (licenseFromLicenseFile) {
    return licenseFromLicenseFile;
  }

  return {
    licenses: [],
    licensePath: undefined,
  };
}
