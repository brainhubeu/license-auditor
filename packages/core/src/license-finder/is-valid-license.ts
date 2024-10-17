import {
  type License,
  type LicenseId,
  licenseIdsSet,
  licenseMap,
} from "@license-auditor/licenses";

function isLicenseId(licenseId: unknown): licenseId is LicenseId {
  return licenseIdsSet.has(licenseId as LicenseId);
}

export function findLicense(licenseId: unknown): License | undefined {
  if (isLicenseId(licenseId)) {
    return licenseMap.get(licenseId);
  }
}
