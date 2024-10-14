import { licenses } from "../license/licenses";

export function isValidLicense(license: unknown): license is License {
  if (typeof license !== "string") {
    return false;
  }
  return licenses.includes(license.trim());
}
