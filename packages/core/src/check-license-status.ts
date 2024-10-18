import type { License, LicenseId } from "@license-auditor/licenses";

export interface AuditSummary {
  whitelist: number;
  blacklist: number;
  unknown: number;
}

export type LicenseStatus = keyof AuditSummary;

// todo: import from a shared package from /tooling after config is actually pulled from the cli
export type Config = {
  blacklist: LicenseId[];
  whitelist: LicenseId[];
  modules: Record<string, string>;
};
// todo: remove after config is actually pulled from the cli
export const tempConfig: Config = {
  blacklist: ["Adobe-Glyph", "CECILL-1.0", "xzoom"],
  whitelist: ["MIT", "Apache-2.0", "ISC", "BSD-3-Clause"],
  modules: {},
};

function belongsToList(list: LicenseId[], licenseId: LicenseId): boolean {
  return list.some((listLicenseId) => listLicenseId === licenseId);
}

export function checkLicenseStatus(
  license: License,
  config: Config
): LicenseStatus {
  if (belongsToList(config.whitelist, license.licenseId)) {
    return "whitelist";
  }
  if (belongsToList(config.blacklist, license.licenseId)) {
    return "blacklist";
  }
  return "unknown";
}
