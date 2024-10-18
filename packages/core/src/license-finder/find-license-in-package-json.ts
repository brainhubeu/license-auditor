import type { License } from "@license-auditor/licenses";
import { findLicense } from "./is-valid-license";
import { validatePackageJson } from "../file-utils";

function retrieveLicenseFromTypeField(license: unknown): License[] {
  if (typeof license === "object" && !!license && "type" in license) {
    return findLicense(license.type);
  }
  return [];
}

function retrieveLicenseByField<T extends string>(
  packageJson: object & Record<T, unknown>,
  licenseField: T
): License[] {
  if (typeof packageJson[licenseField] === "string") {
    return findLicense(packageJson[licenseField]);
  }

  if (typeof packageJson[licenseField] === "object") {
    if (Array.isArray(packageJson[licenseField])) {
      return packageJson[licenseField]
        .flatMap((l) => findLicense(l) ?? retrieveLicenseFromTypeField(l))
        .filter(Boolean);
    }
    return retrieveLicenseFromTypeField(packageJson[licenseField]);
  }
  return [];
}

export function findLicenseInPackageJson(packageJson: object): License[] {
  const validationResult = validatePackageJson(packageJson);

  if (!validationResult) {
    console.error(
      "Failed validation of package.json - no license or licenses field"
    );
    return [];
  }

  if ("license" in packageJson) {
    return retrieveLicenseByField(packageJson, "license");
  }
  if ("licenses" in packageJson) {
    return retrieveLicenseByField(packageJson, "licenses");
  }
  return [];
}
