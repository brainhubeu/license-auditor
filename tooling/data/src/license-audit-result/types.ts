import type { OverridesType } from "../config/types.js";
import type { License, LicenseStatus } from "../licenses/types.js";

export interface DetectedLicense {
  packageName: string;
  packagePath: string;
  licenses: License[];
  status: LicenseStatus;
  licensePath: string | undefined;
  licenseExpression: string | undefined;
  needsVerification: boolean | undefined;
}

export type AssignedType = NonNullable<
  Pick<OverridesType, "assignments">["assignments"]
>;
export type ExcludedType = NonNullable<
  Pick<OverridesType, "excluded">["excluded"]
>;

export interface LicenseAuditResult {
  groupedByStatus: Record<LicenseStatus, DetectedLicense[]>;
  excluded: ExcludedType;
  assigned: AssignedType;
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
}
