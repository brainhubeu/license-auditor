import * as fs from "node:fs";
import * as path from "node:path";
import { findLicenseInPackageJson } from "./find-license-in-package-json";

export function findLicense(
  packageJson: object,
  packagePath: string,
): {
  license?: License;
  licensePath?: string | undefined;
} {
  let license = findLicenseInPackageJson(packageJson);

  if (license) {
    return {
      license,
      licensePath: path.join(packagePath, "package.json"),
    };
  }

  return {};
}
