import type { License } from "@license-auditor/data";

export interface LicensesWithPath {
  licenses: License[];
  licensePath?: string;
  needsVerification?: boolean;
}
