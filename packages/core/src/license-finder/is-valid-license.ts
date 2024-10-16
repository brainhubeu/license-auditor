import { type License, licenses } from "@license-auditor/licenses";

export function isValidLicense(license: unknown): license is License {
  if (typeof license !== "string") {
    return false;
  }
  return licenses.some((l) => l.licenseId === license);
}
