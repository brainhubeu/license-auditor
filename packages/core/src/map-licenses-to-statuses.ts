import type {
  ConfigType,
  DetectedLicense,
  LicenseWithSource,
} from "@license-auditor/data";
import type { LicenseStatus } from "./check-license-status.js";
import type { LicensesWithPathAndStatus } from "./license-finder/licenses-with-path.js";
import { parseVerificationStatusToMessage } from "./parse-verification-status-to-message.js";
import { resolveLicenseStatus } from "./resolve-license-status.js";

type NotFoundMap = Map<string, { packagePath: string; errorMessage: string }>;
type NeedsUserVerificationMap = Map<
  string,
  { packagePath: string; verificationMessage: string }
>;
type GroupedByStatus = Record<LicenseStatus, DetectedLicense[]>;

export async function mapLicensesToStatus(
  licenses: Map<
    string,
    {
      packagePath: string;
      packageName: string;
      licensesWithPath: LicensesWithPathAndStatus;
    }
  >,
  config: ConfigType,
): Promise<{
  groupedByStatus: GroupedByStatus;
  notFound: NotFoundMap;
  needsUserVerification: NeedsUserVerificationMap;
}> {
  const groupedByStatus: GroupedByStatus = {
    whitelist: [],
    blacklist: [],
    unknown: [],
  };

  const notFound: NotFoundMap = new Map();

  const needsUserVerification: NeedsUserVerificationMap = new Map();

  for (const {
    licensesWithPath,
    packageName,
    packagePath,
  } of licenses.values()) {
    const isPackageLicense = hasLicenses(licensesWithPath);

    if (!isPackageLicense) {
      notFound.set(packageName, {
        packagePath,
        errorMessage: `License not found in package.json and in license file in ${packagePath}`,
      });
      continue;
    }

    if (
      licensesWithPath.verificationStatus !== "ok" &&
      licensesWithPath.verificationStatus !== undefined
    ) {
      needsUserVerification.set(packageName, {
        packagePath,
        verificationMessage: parseVerificationStatusToMessage(
          licensesWithPath.verificationStatus,
          packageName,
          packagePath,
        ),
      });
      continue;
    }

    const missmatchedLicenses = checkLicenseMismatch(licensesWithPath);

    if (missmatchedLicenses) {
      needsUserVerification.set(packageName, {
        packagePath,
        verificationMessage: `licenses in package.json and in license file are not matching ${packageName}`,
      });
      continue;
    }

    const status = resolveLicenseStatus(licensesWithPath, config);

    const detectedLicense: DetectedLicense = {
      packageName,
      packagePath,
      status,
      licenses: licensesWithPath.licenses,
      licenseExpression: licensesWithPath.licenseExpression,
      licensePath: licensesWithPath.licensePath,
      verificationStatus: licensesWithPath.verificationStatus,
    };

    groupedByStatus[status].push(detectedLicense);
  }

  return {
    groupedByStatus,
    notFound,
    needsUserVerification,
  };
}

function hasLicenses(licensesWithPath: LicensesWithPathAndStatus): boolean {
  const hasLicenses = licensesWithPath.licenses.length > 0;

  return hasLicenses;
}

function checkLicenseMismatch(
  licensesWithPath: LicensesWithPathAndStatus,
): boolean {
  const licenses = licensesWithPath.licenses;

  // Group licenses by their source
  const licensesBySource = licenses.reduce(
    (acc, license) => {
      if (license.source) {
        if (!acc[license.source]) {
          acc[license.source] = [];
        }
        acc[license.source]?.push(license);
      }
      return acc;
    },
    {} as Record<string, LicenseWithSource[]>,
  );

  // Check if there are licenses from different sources
  const sources = Object.keys(licensesBySource);

  if (sources.length < 2) {
    return false; // No mismatch if there is only one source
  }

  // Check if all licenses are present in both sources
  const allLicenseIds = new Set(licenses.map((license) => license.licenseId));

  for (const source of sources) {
    const sourceLicenseIds = new Set(
      licensesBySource[source]?.map((license) => license.licenseId),
    );
    if (allLicenseIds.size !== sourceLicenseIds.size) {
      return true; // Mismatch if not all licenses are present in this source
    }
  }

  return false; // No mismatch if all licenses are present in both sources
}
