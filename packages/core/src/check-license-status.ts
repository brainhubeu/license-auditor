export type LicenseStatus = "allowed" | "disallowed" | "unknown";

export function checkLicenseStatus(license: LicenseResult): LicenseStatus {
  // todo: compare license with the whitelist/banlist provided through configuration
  return "allowed";
}
