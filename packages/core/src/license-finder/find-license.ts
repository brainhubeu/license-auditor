import * as path from "node:path";
import { validatePackageJson } from "../file-utils";
import { findLicenseInLicenseFile } from "./find-license-in-license-file";
import { findLicenseInPackageJson } from "./find-license-in-package-json";
import type { LicensesWithPath } from "./licenses-with-path";

export function findLicenses(
  packageJson: object,
  packagePath: string,
): LicensesWithPath {
  const validationResult = validatePackageJson(packageJson);

  const packageJsonPath = path.join(packagePath, "package.json");

  if (validationResult.success) {
    const licenseFromPackageJson = findLicenseInPackageJson(packageJson);
    if (licenseFromPackageJson) {
      return {
        licenses: licenseFromPackageJson,
        licensePath: packageJsonPath,
      };
    }
  } else {
    console.error(
      `Failed validation of license(s) field in package.json at ${packageJsonPath}`,
    );
    console.error(validationResult.error.message);
    console.error("Make sure the provided license has correct format.");
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
