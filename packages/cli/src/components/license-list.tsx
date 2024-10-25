import type { LicenseInfo } from "@brainhubeu/license-auditor-core";
import figures from "figures";
import { Box, Text } from "ink";

interface LicenseListProps {
  licenses: LicenseInfo[];
}

export default function LicenseList({ licenses }: LicenseListProps) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {licenses.map((l) => (
        <Box key={l.package}>
          <Text color="gray">{figures.pointerSmall}</Text>
          <Text> {l.package} </Text>
          <Text color="cyan">{l.license.licenseId}</Text>
          <Text>: {l.licensePath}</Text>
        </Box>
      ))}
    </Box>
  );
}
