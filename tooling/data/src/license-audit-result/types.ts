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
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
  warning?: string;
}
