import type { DetectedLicense } from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";

interface LicenseListProps {
  detectedLicenses: DetectedLicense[];
}

export default function LicenseList({ detectedLicenses }: LicenseListProps) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {detectedLicenses.map(
        ({
          packageName,
          licenseExpression,
          licenses,
          licensePath,
          needsVerification,
        }) => {
          if (needsVerification && licenses.length > 1) {
            return (
              <Box key={packageName}>
                <Text color="gray">{figures.pointerSmall}</Text>
                <Text key={packageName}>
                  We’ve found multiple licenses in the license file at{" "}
                  {licensePath}. Please review package {packageName} and assign
                  a matching license or skip the check by listing it in the
                  overrides field of the config file.
                </Text>
              </Box>
            );
          }

          return (
            <Box key={packageName}>
              <Text color="gray">{figures.pointerSmall}</Text>
              <Text> {packageName} </Text>
              {licenseExpression ? (
                <Text color="cyan">{licenseExpression}</Text>
              ) : (
                <Text color="cyan">
                  {licenses.map(({ licenseId }) => licenseId).join(", ")}
                </Text>
              )}
              <Text>: {licensePath}</Text>
            </Box>
          );
        },
      )}
    </Box>
  );
}
