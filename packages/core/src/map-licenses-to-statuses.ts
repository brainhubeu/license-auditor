import type {
  ConfigType,
  DetectedLicense,
  LicenseWithSource,
} from "@license-auditor/data";
import {
  type LicenseStatus,
  checkLicenseStatus,
} from "./check-license-status.js";
import type { PackageLicensesWithPath } from "./get-all-licenses.js";
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
  packageLicensesWithPath: PackageLicensesWithPath,
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
  } of packageLicensesWithPath.values()) {
    const { licenses, licensePath, licenseExpression, verificationStatus } =
      licensesWithPath;

    const hasPackageLicense = licenses.length > 0;

    if (!hasPackageLicense) {
      notFound.set(packageName, {
        packagePath,
        errorMessage: `License not found in package.json and in license file in ${packagePath}`,
      });
      continue;
    }

    if (
      verificationStatus === "notAllLicensesFoundInFile" ||
      verificationStatus === "licenseFileExistsButUnknownLicense"
    ) {
      needsUserVerification.set(packageName, {
        packagePath,
        verificationMessage: parseVerificationStatusToMessage(
          verificationStatus,
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
        verificationMessage: parseVerificationStatusToMessage(
          "missmatchInLicenseSources",
          packageName,
          packagePath,
        ),
      });
      continue;
    }

    const isAllLicensesWhitelisted = allLicensesWhitelisted(licenses, config);

    if (!isAllLicensesWhitelisted) {
      needsUserVerification.set(packageName, {
        packagePath,
        verificationMessage: parseVerificationStatusToMessage(
          "notAllLicensesWhitelisted",
          packageName,
          packagePath,
        ),
      });
    }

    const statusOfAllLicenses = resolveLicenseStatus(licensesWithPath, config);

    const detectedLicense: DetectedLicense = {
      packageName,
      packagePath,
      status: statusOfAllLicenses,
      licenses: licenses,
      licenseExpression: licenseExpression,
      licensePath: licensePath,
      verificationStatus: verificationStatus,
    };

    groupedByStatus[statusOfAllLicenses].push(detectedLicense);
  }

  return {
    groupedByStatus,
    notFound,
    needsUserVerification,
  };
}

const allLicensesWhitelisted = (
  licenses: LicenseWithSource[],
  config: ConfigType,
): boolean => {
  const allLicensesWhitelisted = licenses.every((license) => {
    const licenseStatus = checkLicenseStatus(license, config);
    return licenseStatus === "whitelist";
  });

  if (!allLicensesWhitelisted) {
    return false;
  }

  return true;
};

function groupLicensesBySource(
  licensesWithPath: LicensesWithPathAndStatus,
): Map<string, Set<string>> {
  const licensesBySource: Map<string, Set<string>> = new Map();

  for (const license of licensesWithPath.licenses) {
    if (!licensesBySource.has(license.source)) {
      licensesBySource.set(license.source, new Set());
    }
    licensesBySource.get(license.source)?.add(license.licenseId);
  }

  return licensesBySource;
}

function findSmallestSource(
  licensesBySource: Map<string, Set<string>>,
): [string | null, Set<string> | null] {
  let smallestSource: string | null = null;
  let smallestSet: Set<string> | null = null;

  for (const [source, licenseSet] of licensesBySource.entries()) {
    if (smallestSet === null || licenseSet.size < smallestSet.size) {
      smallestSource = source;
      smallestSet = licenseSet;
    }
  }

  return [smallestSource, smallestSet];
}

function hasMismatch(
  smallestSet: Set<string> | null,
  licensesBySource: Map<string, Set<string>>,
  smallestSource: string | null,
): boolean {
  if (smallestSet === null) {
    return false; // No licenses to compare
  }

  for (const [source, licenseSet] of licensesBySource.entries()) {
    if (source === smallestSource) {
      continue;
    }

    for (const licenseId of smallestSet) {
      if (!licenseSet.has(licenseId)) {
        return true; // Mismatch found
      }
    }
  }

  return false; // No mismatch found
}

function checkLicenseMismatch(
  licensesWithPath: LicensesWithPathAndStatus,
): boolean {
  const licensesBySource = groupLicensesBySource(licensesWithPath);
  const [smallestSource, smallestSet] = findSmallestSource(licensesBySource);
  return hasMismatch(smallestSet, licensesBySource, smallestSource);
}
