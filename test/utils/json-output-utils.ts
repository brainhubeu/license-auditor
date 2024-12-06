import type { DetectedLicense, JsonResults, LicenseWithSource } from '@license-auditor/data';

function getPackageName(packageName: string) {
  return packageName.split('@')[0];
}
function getSimpleLicense(license: LicenseWithSource) {
  return {
    name: license.name,
    licenseId: license.licenseId,
    source: license.source,
  }
}
function getSimplePackageWithLicenses(result: DetectedLicense) {
  return {
    packageName: result.packageName,
    packagePath: result.packagePath,
    status: result.status,
    licenses: result.licenses.map(getSimpleLicense),
  };
}

export function getWhitelistedLicenses(jsonOutput: JsonResults, packageFilter?: string[] | null, licenseFilter?: string[] | null) {
  return jsonOutput.whitelist
    .filter((result) => !licenseFilter || licenseFilter.some(licenseId => result.licenses.some(license => license.licenseId === licenseId)))
    .filter((result) => !packageFilter || packageFilter.includes(getPackageName(result.packageName)))
    .map(getSimplePackageWithLicenses);
}

export function getBlacklistedLicenses(jsonOutput: JsonResults, packageFilter?: string[] | null, licenseFilter?: string[] | null) {
  return jsonOutput.blacklist
    .filter((result) => !licenseFilter || licenseFilter.some(licenseId => result.licenses.some(license => license.licenseId === licenseId)))
    .filter((result) => !packageFilter || packageFilter.includes(getPackageName(result.packageName)))
    .map(getSimplePackageWithLicenses);
}

export function getUnknownLicenses(jsonOutput: JsonResults, packageFilter?: string[] | null) {
  return jsonOutput.unknown
    .filter((result) => !packageFilter || packageFilter.includes(getPackageName(result.packageName)))
    .map(getSimplePackageWithLicenses);
}

export function getNotFoundLicenses(jsonOutput: JsonResults, packageFilter?: string[] | null) {
  return jsonOutput.notFound
    .filter((result) => !packageFilter || packageFilter.includes(getPackageName(result.packageName)));
}
export function getNeedsUserVerificationLicenses(jsonOutput: JsonResults, packageFilter?: string[] | null) {
  return jsonOutput.needsUserVerification
    .filter((result) => !packageFilter || packageFilter.includes(getPackageName(result.packageName)));
}
