import { type License, licenses } from "@license-auditor/licenses";

const licenseMap = new Map<string, License>(
  licenses.map((l) => [l.licenseId, l]),
);

export function findLicense(licenseId: unknown): License | undefined {
  if (typeof licenseId !== "string") {
    return undefined;
  }
  return licenseMap.get(licenseId);
}
