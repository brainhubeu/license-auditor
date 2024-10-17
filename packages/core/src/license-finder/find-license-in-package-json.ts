import { findLicense } from "./is-valid-license";

function retrieveLicenseFromTypeField(license: unknown): LicenseResult {
  if (typeof license === "object" && !!license && "type" in license) {
    return findLicense(license.type);
  }
}

function retrieveLicenseByField<T extends string>(
  packageJson: object & Record<T, unknown>,
  licenseField: T,
): LicenseResult {
  if (typeof packageJson[licenseField] === "string") {
    return findLicense(packageJson[licenseField]);
  }

  if (typeof packageJson[licenseField] === "object") {
    if (Array.isArray(packageJson[licenseField])) {
      return packageJson[licenseField]
        .map((l) => findLicense(l) ?? retrieveLicenseFromTypeField(l))
        .filter(Boolean);
    }
    return retrieveLicenseFromTypeField(packageJson[licenseField]);
  }
}

export function findLicenseInPackageJson(packageJson: object): LicenseResult {
  if ("license" in packageJson) {
    return retrieveLicenseByField(packageJson, "license");
  }
  if ("licenses" in packageJson) {
    return retrieveLicenseByField(packageJson, "licenses");
  }
}
