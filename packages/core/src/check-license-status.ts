import type { ConfigType } from "@brainhubeu/license-auditor-data";
import type { License, LicenseId } from "@brainhubeu/license-auditor-data";

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
