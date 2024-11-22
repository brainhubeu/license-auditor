import type { VerificationStatus } from "@license-auditor/data";

const verificationMessages: Readonly<
  Record<
    VerificationStatus,
    (packagePath: string, packageName: string) => string
  >
> = {
  licenseFileExistsButNoLicense: (packagePath, packageName): string =>
    `We’ve found a license file, but no matching licenses in it in path ${packagePath}. Please review package ${packageName} and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  licenseNotFound: (packagePath, packageName): string =>
    `We couldn’t find a license for package ${packageName} in path ${packagePath}. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  notAllLicensesFounded: (packagePath, packageName): string =>
    `We found some, but not all licenses for package ${packageName} in path ${packagePath}. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  notAllLicensesWhitelisted: (packagePath, packageName): string =>
    `Not all licenses are whitelisted for package ${packageName} in path ${packagePath}. Please review the package`,
  ok: (packagePath, packageName): string =>
    `Please review package ${packageName} in path ${packagePath}`,
};

export function parseVerificationStatusToMessage(
  status: VerificationStatus,
  packagePath: string,
  packageName: string,
): string {
  const messageTemplate = verificationMessages[status];
  return messageTemplate(packagePath, packageName);
}
