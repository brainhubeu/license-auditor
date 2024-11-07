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
          {detectedLicense.licenses.map((license) => (
            <Text
              color="cyan"
              key={`${detectedLicense.packageName}-${license.licenseId}`}
            >
              {license.licenseId}
            </Text>
          ))}
          <Text>: {detectedLicense.licensePath}</Text>
        </Box>
      ))}
    </Box>
  );
}
