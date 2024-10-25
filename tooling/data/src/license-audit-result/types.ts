import type { License, LicenseStatus } from "../licenses/types.js";

export interface DetectedLicense {
  packageName: string;
  packagePath: string;
  license: License & { status: LicenseStatus };
  licensePath: string | undefined;
  needsVerification?: boolean;
}

export interface LicenseAuditResult {
  groupedByStatus: Record<LicenseStatus, DetectedLicense[]>;
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
}
