import type { License } from "@license-auditor/data";
import { findLicenseById } from "./find-license-by-id.js";

function retrieveLicenseFromTypeField(license: unknown): License[] {
  if (typeof license === "object" && !!license && "type" in license) {
    return findLicenseById(license.type);
  }
  return [];
}

function retrieveLicenseByField<T extends string>(
  packageJson: object & Record<T, unknown>,
  licenseField: T,
): License[] {
  if (typeof packageJson[licenseField] === "string") {
    return findLicenseById(packageJson[licenseField]);
  }

  if (typeof packageJson[licenseField] === "object") {
    if (Array.isArray(packageJson[licenseField])) {
      return packageJson[licenseField]
        .flatMap((l) => findLicenseById(l) ?? retrieveLicenseFromTypeField(l))
        .filter(Boolean);
    }
    return retrieveLicenseFromTypeField(packageJson[licenseField]);
  }
  return [];
}

export function findLicenseInPackageJson(packageJson: object): License[] {
  if ("license" in packageJson) {
    return retrieveLicenseByField(packageJson, "license");
  }
  if ("licenses" in packageJson) {
    return retrieveLicenseByField(packageJson, "licenses");
  }
  return [];
}
