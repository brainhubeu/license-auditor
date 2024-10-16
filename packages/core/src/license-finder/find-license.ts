import * as path from "node:path";
import { findLicenseInLicenseFile } from "./find-license-in-license-file";
import { findLicenseInPackageJson } from "./find-license-in-package-json";
import { findLicenseInReadme } from "./find-license-in-readme";

const licenseFiles = [
  "LICENSE",
  "LICENCE",
  "LICENSE.md",
  "LICENCE.md",
  "LICENSE.txt",
  "LICENSE-MIT",
  "LICENSE.BSD",
] as const;

export function findLicense(
  packageJson: object,
  packagePath: string
): LicenseWithPath {
  const licenseFromPackageJson = findLicenseInPackageJson(packageJson);
  if (licenseFromPackageJson) {
    return {
      license: licenseFromPackageJson,
      licensePath: path.join(packagePath, "package.json"),
    };
  }

  for (const licenseFile in licenseFiles) {
    const basicPath = path.join(packagePath, licenseFile);
    const licenseFromLicenseFile = findLicenseInLicenseFile(basicPath);
    if (licenseFromLicenseFile) {
      return licenseFromLicenseFile;
    }
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
