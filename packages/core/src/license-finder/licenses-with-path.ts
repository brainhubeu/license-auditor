import type { License } from "@license-auditor/licenses";

export interface LicensesWithPath {
  licenses: License[];
  licensePath?: string;
  needsVerification?: boolean;
}
