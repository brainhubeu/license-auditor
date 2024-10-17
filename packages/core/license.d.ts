import type { type License } from "@license-auditor/licenses";

declare global {
  type LicenseResult = License | License[] | undefined;
  interface LicenseWithPath {
    license: LicenseResult;
    licensePath: string | undefined;
    needsVerification?: boolean;
  }
}
