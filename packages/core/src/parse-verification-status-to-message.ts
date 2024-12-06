import type { VerificationStatus } from "@license-auditor/data";

const verificationMessages: Readonly<
  Record<
    VerificationStatus,
    (packagePath: string, packageName: string) => string
  >
> = {
  licenseFileExistsButUnknownLicense: (packagePath, packageName): string =>
    `We’ve found a license file, but no matching licenses in it in path ${packagePath}. Please review package ${packageName} and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  licenseFilesExistButSomeAreUncertain: (packagePath, packageName): string =>
    `We've found few license files, but we could not match a license for some of them for package ${packageName} in path ${packagePath}. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  someButNotAllLicensesWhitelisted: (packagePath, packageName): string =>
    `Some but not all licenses are whitelisted for package ${packageName} in path ${packagePath}. Please review the package.`,
  licenseFileNotFound: (packagePath, packageName): string =>
    `We couldn’t find a license file for package ${packageName} in path ${packagePath}. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  ok: (packagePath, packageName): string =>
    `Package ${packageName} in path ${packagePath} has a valid license.`,
};

export function parseVerificationStatusToMessage(
  status: VerificationStatus,
  packagePath: string,
  packageName: string,
): string {
  const messageTemplate = verificationMessages[status];
  return messageTemplate(packagePath, packageName);
}
