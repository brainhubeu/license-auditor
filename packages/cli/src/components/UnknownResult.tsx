import figures from "figures";
import { Box, Text } from "ink";
import React from "react";
import LicenseList from "./LicenseList.js";

interface UnknownResultProps {
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
    unknown: Array<{
      package: string;
      licensePath: string;
      license: { licenseId: string };
    }>;
  };
}

export default function UnknownResult({ groupedByStatus }: UnknownResultProps) {
  const hasBlacklisted = groupedByStatus.blacklist.length > 0;
  const statusText = hasBlacklisted ? "FAILED" : "WARNING";
  const headerColor = hasBlacklisted ? "red" : "yellow";

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        <Text backgroundColor={headerColor} color="black" bold>
          {`${figures.warning} LICENSE AUDIT ${statusText} `}
        </Text>
      </Box>
      <Box>
        <Text color="green">{figures.tick}</Text>
        <Text>{groupedByStatus.whitelist.length} license(s) are compliant</Text>
      </Box>
      {hasBlacklisted && (
        <Box>
          <Text color="red">{figures.cross}</Text>
          <Text>
            {" "}
            {groupedByStatus.blacklist.length} license(s) are blacklisted:
          </Text>
        </Box>
      )}
      {hasBlacklisted && <LicenseList licenses={groupedByStatus.blacklist} />}
      <Box>
        <Text color="yellow">{figures.warning}</Text>
        <Text>{groupedByStatus.unknown.length} license(s) are unknown:</Text>
      </Box>
      <LicenseList licenses={groupedByStatus.unknown} />
    </Box>
  );
}
