import type { License } from "@brainhubeu/license-auditor-data";

export interface LicensesWithPath {
  licenses: License[];
  licensePath: string | undefined;
  needsVerification?: boolean;
}
