import type {
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
  // licenses: License[];
  licenses: LicenseWithSource[];
  status: LicenseStatus;
  licensePath: string[];
  licenseExpression: string | undefined;
  verificationStatus: VerificationStatus | undefined;
}

// export interface LicenseAuditResult {
// 	overrides: {
// 		notFoundOverrides: string[];
// 	};
// 	licenses: Map<
// 		string,
// 		{
// 			packageName: string;
// 			licensesWithPath: LicenseFinderType;
// 		}
// 	>;
// 	warning?: string | undefined;
// }
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
