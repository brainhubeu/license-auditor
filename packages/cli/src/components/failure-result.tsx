import type { LicenseAuditResult } from "@brainhubeu/license-auditor-core";
import figures from "figures";
import { Box, Text } from "ink";
import React from "react";
import { describeLicenseCount } from "../utils/describe-license-count.js";
import LicenseList from "./license-list.js";

export default function FailureResult({
  groupedByStatus,
}: Omit<LicenseAuditResult, "notFound">) {
  const whitelistResultText = describeLicenseCount(
    groupedByStatus.whitelist.length,
  );
  const blacklistedResultText = describeLicenseCount(
    groupedByStatus.blacklist.length,
  );

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        <Text backgroundColor="red" color="white" bold>
          {` ${figures.cross} LICENSE AUDIT FAILED `}
        </Text>
      </Box>
      <Box>
        <Text color="green">{figures.tick}</Text>
        <Text>{whitelistResultText} compliant</Text>
      </Box>
      <Box>
        <Text color="red">{figures.cross}</Text>
        <Text> {blacklistedResultText} blacklisted:</Text>
      </Box>
      <LicenseList licenses={groupedByStatus.blacklist} />
    </Box>
  );
}
