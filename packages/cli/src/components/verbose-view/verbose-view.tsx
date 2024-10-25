import type { LicenseAuditResult } from "@license-auditor/data";
import { Box, Text } from "ink";
import React from "react";
import { FoundLicenseSection } from "./found-license-section.js";
import { NotFoundLicenseSection } from "./not-found-license-section.js";

export default function VerboseView({
  result,
}: { result: LicenseAuditResult }) {
  const hasWhitelisted = result.groupedByStatus.whitelist.length > 0;
  const hasBlacklisted = result.groupedByStatus.blacklist.length > 0;
  const hasUnknown = result.groupedByStatus.unknown.length > 0;
  const hasNotFound = result.notFound.size > 0;

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text backgroundColor="cyan" color="black" bold>
          {" Verbose License Audit Results "}
        </Text>
      </Box>
      {hasWhitelisted && (
        <FoundLicenseSection
          title="Whitelisted Licenses"
          licenses={result.groupedByStatus.whitelist}
        />
      )}
      {hasBlacklisted && (
        <FoundLicenseSection
          title="Blacklisted Licenses"
          licenses={result.groupedByStatus.blacklist}
        />
      )}
      {hasUnknown && (
        <FoundLicenseSection
          title="Unknown Licenses"
          licenses={result.groupedByStatus.unknown}
        />
      )}
      {hasNotFound && <NotFoundLicenseSection notFound={result.notFound} />}
    </Box>
  );
}
