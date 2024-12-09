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
  config: ConfigType
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
      verificationStatus === "licenseFilesExistButSomeAreUncertain" ||
      verificationStatus === "licenseFileExistsButUnknownLicense"
    ) {
      needsUserVerification.set(packageName, {
        packagePath,
        verificationMessage: parseVerificationStatusToMessage(
          verificationStatus,
          packagePath,
          packageName,
        ),
      });
      continue;
    }

    const areSomeButNotAllLicensesWhitelisted =
      someButNotAllLicensesWhitelisted(licenses, config);

    if (areSomeButNotAllLicensesWhitelisted) {
      needsUserVerification.set(packageName, {
        packagePath,
        verificationMessage: parseVerificationStatusToMessage(
          "someButNotAllLicensesWhitelisted",
          packagePath,
          packageName,
        ),
      });

      // we don't continue here because we want this package to appear in the blacklisted results
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

const someButNotAllLicensesWhitelisted = (
  licenses: LicenseWithSource[],
  config: ConfigType
): boolean => {
  const whitelistedLicenses = licenses.filter((license) => {
    const licenseStatus = checkLicenseStatus(license, config);
    return licenseStatus === "whitelist";
  });

  return (
    !!whitelistedLicenses.length && whitelistedLicenses.length < licenses.length
  );
};
