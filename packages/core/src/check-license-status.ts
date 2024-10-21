import type { ConfigType } from "@license-auditor/config";
import type { License, LicenseId } from "@license-auditor/licenses";

export type LicenseStatus = "whitelist" | "blacklist" | "unknown";

function belongsToList(list: LicenseId[], licenseId: LicenseId): boolean {
  return list.some((listLicenseId) => listLicenseId === licenseId);
}

export function checkLicenseStatus(
  license: License,
  config: ConfigType,
): LicenseStatus {
  if (belongsToList(config.whitelist, license.licenseId)) {
    return "whitelist";
  }
  if (belongsToList(config.blacklist, license.licenseId)) {
    return "blacklist";
  }
  return "unknown";
}
