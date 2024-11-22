import * as path from "node:path";
import type { ConfigType } from "@license-auditor/data";
import type { PackageJsonType } from "../file-utils.js";
import { parseLicenseFiles } from "./find-license-in-license-file.js";
import { findLicenseInPackageJson } from "./find-license-in-package-json.js";
import type { LicensesWithPath } from "./licenses-with-path.js";

export async function findLicenses(
  packageJson: PackageJsonType,
  packagePath: string,
  config: ConfigType,
): Promise<LicensesWithPath> {
  const packageJsonPath = path.join(packagePath, "package.json");

  const licenseFromPackageJson = findLicenseInPackageJson(packageJson);
  if (licenseFromPackageJson.licenses.length > 0) {
    return {
      ...licenseFromPackageJson,
      licensePath: packageJsonPath,
      verificationStatus: "ok",
    };
  }

  const licenseFromLicenseFile = await parseLicenseFiles(packagePath, config);
  if (licenseFromLicenseFile) {
    return licenseFromLicenseFile;
  }

  return {
    licenses: [],
    licensePath: undefined,
    verificationStatus: "licenseNotFound",
  };
}
