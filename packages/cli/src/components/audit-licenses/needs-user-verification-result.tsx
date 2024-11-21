import type {
  LicenseAuditResult,
  VerificationStatus,
} from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";
import { describeLicenseCount } from "./result-messages.js";

export default function NeedsUserVerificationResult({
  needsUserVerification,
}: Omit<LicenseAuditResult, "notFound" | "groupedByStatus">) {
  const describePackagesCount = describeLicenseCount(
    needsUserVerification.size,
    "package is",
    "packages are",
  );

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="yellow">{figures.warning}</Text>
        <Text>{describePackagesCount} requires manual checking:</Text>
      </Box>
      <Box flexDirection="column" marginLeft={2}>
        {Array.from(needsUserVerification).map(
          ([packageName, { packagePath, status }]) => (
            <Box key={packagePath}>
              <Text color="gray">{figures.pointerSmall}</Text>
              <Text>
                {getVerificationMessage(status, packagePath, packageName)}
              </Text>
            </Box>
          ),
        )}
      </Box>
    </Box>
  );
}

const verificationMessages: Readonly<
  Record<
    VerificationStatus,
    (packagePath: string, packageName: string) => string
  >
> = {
  moreThanOneLicenseFromLicenseFile: (packagePath, packageName) =>
    `We’ve found multiple licenses in the license file in path ${packagePath}. Please review package ${packageName} and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  licenseFileExistsButNoLicense: (packagePath, packageName) =>
    `We’ve found a license file, but no matching licenses in it in path ${packagePath}. Please review package ${packageName} and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  licenseFileReadError: (packagePath, packageName) =>
    `There was an error reading the license file in path ${packagePath}. Please review package ${packageName} and resolve the issue.`,
  licenseNotFound: (packagePath, packageName) =>
    `We couldn’t find a license for package ${packageName} in path ${packagePath}. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
  ok: (packagePath, packageName) =>
    `Please review package ${packageName} in path ${packagePath}`,
};

function getVerificationMessage(
  status: VerificationStatus,
  packagePath: string,
  packageName: string,
): string {
  const messageTemplate = verificationMessages[status];
  return messageTemplate(packagePath, packageName);
}
