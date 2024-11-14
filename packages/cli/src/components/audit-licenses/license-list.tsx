import type { DetectedLicense } from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";

interface LicenseListProps {
  detectedLicenses: DetectedLicense[];
}

export default function LicenseList({ detectedLicenses }: LicenseListProps) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {detectedLicenses.map((detectedLicense) => (
        <Box key={detectedLicense.packageName}>
          <Text color="gray">{figures.pointerSmall}</Text>
          <Text> {detectedLicense.packageName} </Text>
          {detectedLicense.licenseExpression ? (
            <Text color="cyan">{detectedLicense.licenseExpression}</Text>
          ) : (
            <Text color="cyan">
              {detectedLicense.licenses
                .map((detectedLicense) => detectedLicense.licenseId)
                .join(", ")}
            </Text>
          )}
          <Text>: {detectedLicense.licensePath}</Text>
        </Box>
      ))}
    </Box>
  );
}
