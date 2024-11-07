import { type License, licenseMap } from "@license-auditor/data";

export function findLicenseById(licenseId: unknown): License[] {
  // @ts-expect-error
  if (typeof licenseId === "string" && licenseMap.has(licenseId)) {
    // @ts-expect-error in the line above it's already checked that the element exists in the map
    return [licenseMap.get(licenseId)];
  }
  return [];
}
