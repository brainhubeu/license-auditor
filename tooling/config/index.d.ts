import type { LicenseId } from "@license-auditor/licenses";

export type ConfigType = {
  blacklist: LicenseId[];
  whitelist: LicenseId[];
  modules: Record<string, string>;
};

export declare const licenses: License[];
