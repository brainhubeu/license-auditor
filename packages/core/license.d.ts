import type { type License } from "@license-auditor/licenses";

declare global {
  interface LicensesWithPath {
    licenses: License[];
    licensePath: string | undefined;
  }
}
