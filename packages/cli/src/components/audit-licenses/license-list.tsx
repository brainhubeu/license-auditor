import type { DetectedLicense } from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";

interface LicenseListProps {
  detectedLicenses: DetectedLicense[];
  verbose: boolean;
}

export default function LicenseList({
  detectedLicenses,
  verbose,
}: LicenseListProps) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {detectedLicenses.map(
        ({ packageName, licenseExpression, licenses, licensePath }) => (
          <Box key={packageName} marginBottom={verbose ? 1 : 0}>
            <Text color="gray">{figures.pointerSmall}</Text>
            <Text> {packageName} </Text>
            {licenseExpression ? (
              <Text color="cyan">{licenseExpression}</Text>
            ) : (
              <Text color="cyan">
                {licenses
                  .filter(
                    (license, index, self) =>
                      self.findIndex(
                        (l) => l.licenseId === license.licenseId,
                      ) === index,
                  )
                  .map(({ licenseId }) => licenseId)
                  .join(", ")}
              </Text>
            )}
            {verbose && <Text>: {licensePath}</Text>}
          </Box>
        ),
      )}
    </Box>
  );
}
