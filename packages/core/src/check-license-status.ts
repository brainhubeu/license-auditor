export type LicenseStatus = "allowed" | "disallowed" | "unknown";

export function checkLicenseStatus(license: License): LicenseStatus {
  // todo: compare license with the whitelist/banlist provided through configuration
  return "allowed";
}
