import { isValidLicense } from "./is-valid-license";

function retrieveLicenseFromTypeField(license: unknown): License | undefined {
  if (
    typeof license === "object" &&
    !!license &&
    "type" in license &&
    isValidLicense(license.type)
  ) {
    return license.type;
  }
}

function retrieveLicenseByField<T extends string>(
  packageJson: object & Record<T, unknown>,
  licenseField: T,
): License {
  if (typeof packageJson[licenseField] === "string") {
    if (isValidLicense(packageJson[licenseField])) {
      return packageJson[licenseField];
    }
    return;
  }

  if (typeof packageJson[licenseField] === "object") {
    if (Array.isArray(packageJson[licenseField])) {
      return packageJson[licenseField]
        .map((l) => (isValidLicense(l) ? l : retrieveLicenseFromTypeField(l)))
        .filter(Boolean);
    }
    return retrieveLicenseFromTypeField(packageJson[licenseField]);
  }
}

export function findLicenseInPackageJson(packageJson: object): License {
  if ("license" in packageJson) {
    return retrieveLicenseByField(packageJson, "license");
  }
  if ("licenses" in packageJson) {
    return retrieveLicenseByField(packageJson, "licenses");
  }
}
