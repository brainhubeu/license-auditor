import type { VerificationStatus } from "@license-auditor/data";

const verificationMessages: Readonly<
  Record<
    VerificationStatus,
    (packagePath: string, packageName: string) => string
  >
> = {
  moreThanOneLicenseFromLicenseFile: (packagePath, packageName): string =>
    `We’ve found multiple licenses in the license file in path ${packagePath}. Please review package ${packageName} and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  licenseFileExistsButNoLicense: (packagePath, packageName): string =>
    `We’ve found a license file, but no matching licenses in it in path ${packagePath}. Please review package ${packageName} and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  licenseFileReadError: (packagePath, packageName): string =>
    `There was an error reading the license file in path ${packagePath}. Please review package ${packageName} and resolve the issue.`,
  licenseNotFound: (packagePath, packageName): string =>
    `We couldn’t find a license for package ${packageName} in path ${packagePath}. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
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
