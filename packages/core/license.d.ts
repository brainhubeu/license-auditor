import type { type License, licenses } from "@license-auditor/licenses";

declare global {
  type LicenseResult = License | License[] | undefined;
  interface LicenseWithPath {
    license: LicenseResult;
    licensePath: string | undefined;
  }
}
