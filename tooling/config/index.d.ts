import type { LicenseId } from "@license-auditor/licenses";

export type ConfigType = {
  blacklist: LicenseId[];
  whitelist: LicenseId[];
  overrides: Record<string, LicenseId>;
};
