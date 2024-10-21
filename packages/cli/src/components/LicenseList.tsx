import figures from "figures";
import { Box, Text } from "ink";
import React from "react";

interface LicenseListProps {
  licenses: Array<{
    package: string;
    licensePath: string;
    license: { licenseId: string };
  }>;
}

export default function LicenseList({ licenses }: LicenseListProps) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {licenses.map((license) => (
        <Box key={license.package}>
          <Text color="gray">{figures.pointerSmall}</Text>
          <Text> {license.package} </Text>
          <Text color="cyan">({license.license.licenseId})</Text>
          <Text>: {license.licensePath}</Text>
        </Box>
      ))}
    </Box>
  );
}
