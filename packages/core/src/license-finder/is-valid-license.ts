import { type License, licenses } from "@license-auditor/licenses";

export function findLicense(licenseId: unknown): License | undefined {
  if (typeof licenseId !== "string") {
    return undefined;
  }
  return licenses.find((l) => l.licenseId === licenseId);
}
