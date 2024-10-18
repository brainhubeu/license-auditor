import * as path from "node:path";
import { findLicenseInLicenseFile } from "./find-license-in-license-file";
import { findLicenseInPackageJson } from "./find-license-in-package-json";
import { findLicenseInReadme } from "./find-license-in-readme";

export function findLicenses(
  packageJson: object,
  packagePath: string,
): LicensesWithPath {
  const licenseFromPackageJson = findLicenseInPackageJson(packageJson);
  if (licenseFromPackageJson) {
    return {
      licenses: licenseFromPackageJson,
      licensePath: path.join(packagePath, "package.json"),
    };
  }

  const licenseFromLicenseFile = findLicenseInLicenseFile();
  if (licenseFromLicenseFile) {
    return licenseFromLicenseFile;
  }

  const licenseFromReadmeFile = findLicenseInReadme();
  if (licenseFromReadmeFile) {
    return licenseFromReadmeFile;
  }

  return {
    licenses: [],
    licensePath: undefined,
  };
}
