import { type License, licenseMap } from "@license-auditor/licenses";

export function findLicense(licenseId: unknown): License[] {
  if (typeof licenseId === "string" && licenseMap.has(licenseId)) {
    // @ts-expect-error in the line above it's already checked that the element exists in the map
    return [licenseMap.get(licenseId)];
  }
  return [];
}
