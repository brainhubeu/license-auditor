import type {
  License,
  LicenseStatus,
  VerificationStatus,
} from "../licenses/types.js";

export interface DetectedLicense {
  packageName: string;
  packagePath: string;
  licenses: License[];
  status: LicenseStatus;
  licensePath: string | undefined;
  licenseExpression: string | undefined;
  verificationStatus: VerificationStatus;
}

export interface LicenseAuditResult {
  groupedByStatus: Record<LicenseStatus, DetectedLicense[]>;
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
  overrides: {
    notFoundOverrides: string[];
  };
  needsUserVerification: Map<
    string,
    { packagePath: string; verificationMessage: string }
  >;
}
