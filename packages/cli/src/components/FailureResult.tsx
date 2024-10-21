import figures from "figures";
import { Box, Text } from "ink";
import React from "react";
import LicenseList from "./LicenseList.js";

interface FailureResultProps {
  groupedByStatus: {
    whitelist: Array<{
      package: string;
      licensePath: string;
      license: { licenseId: string };
    }>;
    blacklist: Array<{
      package: string;
      licensePath: string;
      license: { licenseId: string };
    }>;
  };
}

// Global TODO: handle the pluralization of "licenses"
export default function FailureResult({ groupedByStatus }: FailureResultProps) {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        <Text backgroundColor="red" color="white" bold>
          {` ${figures.cross} LICENSE AUDIT FAILED `}
        </Text>
      </Box>
      <Box>
        <Text color="green">{figures.tick}</Text>
        <Text>{groupedByStatus.whitelist.length} license(s) are compliant</Text>
      </Box>
      <Box>
        <Text color="red">{figures.cross}</Text>
        <Text>
          {" "}
          {groupedByStatus.blacklist.length} license(s) are blacklisted:
        </Text>
      </Box>
      <LicenseList licenses={groupedByStatus.blacklist} />
    </Box>
  );
}
