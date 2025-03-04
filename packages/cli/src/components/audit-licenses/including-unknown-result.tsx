import type { LicenseAuditResult } from "@license-auditor/data";
import { Box } from "ink";
import LicenseList from "./license-list.js";
import {
  BlacklistedMessage,
  CompliantMessage,
  FailureHeaderMessage,
  UnknownMessage,
  WarningHeaderMessage,
} from "./result-messages.js";

export default function IncludingUnknownResult({
  groupedByStatus,
  verbose,
}: Omit<
  LicenseAuditResult,
  "notFound" | "needsUserVerification" | "overrides" | "errorResults"
> & {
  verbose: boolean;
}) {
  const hasWhitelisted = groupedByStatus.whitelist.length > 0;
  const hasBlacklisted = groupedByStatus.blacklist.length > 0;

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        {hasBlacklisted ? <FailureHeaderMessage /> : <WarningHeaderMessage />}
      </Box>
      {hasWhitelisted && (
        <Box>
          <CompliantMessage count={groupedByStatus.whitelist.length} />
        </Box>
      )}
      {hasBlacklisted && (
        <>
          <Box marginTop={verbose && hasWhitelisted ? 1 : 0}>
            <BlacklistedMessage count={groupedByStatus.blacklist.length} />
          </Box>
          <LicenseList
            detectedLicenses={groupedByStatus.blacklist}
            verbose={verbose}
          />
        </>
      )}
      <Box>
        <UnknownMessage count={groupedByStatus.unknown.length} />
      </Box>
      <LicenseList
        detectedLicenses={groupedByStatus.unknown}
        verbose={verbose}
      />
    </Box>
  );
}
