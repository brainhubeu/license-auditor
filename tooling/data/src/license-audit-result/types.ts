import type {
  License,
  LicenseStatus,
  LicenseWithSource,
  VerificationStatus,
} from "../licenses/types.js";

export interface DependenciesResult {
  dependencies: string[];
  warning?: string;
}

export interface DetectedLicense {
  packageName: string;
  packagePath: string;
  licenses: (LicenseWithSource)[];
  status: LicenseStatus;
  licensePath: string | undefined;
  licenseExpression: string | undefined;
  // verificationStatus: VerificationStatus;
}

export interface LicenseAuditResult {
  groupedByStatus: Record<LicenseStatus, DetectedLicense[]>;
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
  warning?: string | undefined;
  overrides: {
    notFoundOverrides: string[];
  };
  needsUserVerification: Map<
    string,
    { packagePath: string; verificationMessage: string }
  >;
}
