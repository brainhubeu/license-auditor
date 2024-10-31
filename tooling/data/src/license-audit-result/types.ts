import type { License, LicenseStatus } from "../licenses/types.js";

export interface DetectedLicense {
  package: string;
  path: string;
  license: License & { status: LicenseStatus };
  licensePath: string | undefined;
}

export interface LicenseAuditResult {
  groupedByStatus: Record<LicenseStatus, DetectedLicense[]>;
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
}
