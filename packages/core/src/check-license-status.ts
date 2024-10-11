export type LicenseStatus = "allowed" | "disallowed" | "unknown";

export function checkLicenseStatus(license: string | undefined): LicenseStatus {
  // todo: compare license with the whitelist/banlist provided through configuration
  return "allowed";
}
