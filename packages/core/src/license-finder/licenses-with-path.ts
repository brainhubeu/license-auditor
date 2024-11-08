import type { License } from "@license-auditor/data";

export interface LicensesWithPath {
  licenses: License[];
  licensePath: string | undefined;
  needsVerification?: boolean;
}
