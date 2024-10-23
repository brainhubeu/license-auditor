import type { LicenseAuditResult } from "@brainhubeu/license-auditor-core";
import figures from "figures";
import { Box, Text } from "ink";
import React from "react";
import { describeLicenseCount } from "../utils/describe-license-count.js";
import LicenseList from "./license-list.js";

export default function IncludingUnknownResult({
  groupedByStatus,
}: Omit<LicenseAuditResult, "notFound">) {
  const noLicensesFound =
    groupedByStatus.whitelist.length === 0 &&
    groupedByStatus.blacklist.length === 0 &&
    groupedByStatus.unknown.length === 0;

  if (noLicensesFound) {
    return (
      <Box flexDirection="column">
        <Box marginBottom={1} marginTop={1}>
          <Text backgroundColor="yellow" color="black" bold>
            {` ${figures.warning} LICENSE AUDIT WARNING `}
          </Text>
        </Box>
        <Box>
          <Text color="yellow">{figures.warning}</Text>
          <Text>
            {/* TODO: Let's talk about how to best handle this message */}
            No licenses found. If this is unexpected, please check your
            configuration file.
          </Text>
        </Box>
      </Box>
    );
  }

  const hasBlacklisted = groupedByStatus.blacklist.length > 0;
  const statusText = hasBlacklisted ? "FAILED" : "WARNING";
  const headerColor = hasBlacklisted ? "red" : "yellow";
  const whitelistResultText = describeLicenseCount(
    groupedByStatus.whitelist.length,
  );
  const blacklistedResultText = describeLicenseCount(
    groupedByStatus.blacklist.length,
  );
  const unknownResultText = describeLicenseCount(
    groupedByStatus.unknown.length,
  );

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        <Text backgroundColor={headerColor} color="black" bold>
          {` ${figures.warning} LICENSE AUDIT ${statusText} `}
        </Text>
      </Box>
      <Box>
        <Text color="green">{figures.tick}</Text>
        <Text>{whitelistResultText} compliant</Text>
      </Box>
      {hasBlacklisted && (
        <>
          <Box>
            <Text color="red">{figures.cross}</Text>
            <Text> {blacklistedResultText} blacklisted:</Text>
          </Box>
          <LicenseList licenses={groupedByStatus.blacklist} />
        </>
      )}
      <Box>
        <Text color="yellow">{figures.warning}</Text>
        <Text>{unknownResultText} unknown:</Text>
      </Box>
      <LicenseList licenses={groupedByStatus.unknown} />
    </Box>
  );
}
