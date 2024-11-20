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

export interface LicenseAuditResult {
  groupedByStatus: Record<LicenseStatus, DetectedLicense[]>;
  excluded: string[];
  assigned: NonNullable<Pick<OverridesType, "assignments">["assignments"]>;
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
}
