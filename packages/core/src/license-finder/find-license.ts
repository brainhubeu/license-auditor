import * as path from "node:path";
import { findLicenseInLicenseFile } from "./find-license-in-license-file";
import { findLicenseInPackageJson } from "./find-license-in-package-json";
import { findLicenseInReadme } from "./find-license-in-readme";

export function findLicense(
  packageJson: object,
  packagePath: string,
): LicenseWithPath {
  const licenseFromPackageJson = findLicenseInPackageJson(packageJson);
  if (licenseFromPackageJson) {
    return {
      license: licenseFromPackageJson,
      licensePath: path.join(packagePath, "package.json"),
    };
  }

  const licenseFromLicenseFile = findLicenseInLicenseFile(packagePath);
  if (licenseFromLicenseFile) {
    return licenseFromLicenseFile;
  }

  const licenseFromReadmeFile = findLicenseInReadme();
  if (licenseFromReadmeFile) {
    return licenseFromReadmeFile;
  }

  return {
    license: undefined,
    licensePath: undefined,
  };
}
