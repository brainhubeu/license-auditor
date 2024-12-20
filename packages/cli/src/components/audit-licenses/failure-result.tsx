import type { LicenseAuditResult } from "@license-auditor/data";
import { Box } from "ink";
import LicenseList from "./license-list.js";
import {
  BlacklistedMessage,
  CompliantMessage,
  FailureHeaderMessage,
} from "./result-messages.js";

export default function FailureResult({
  groupedByStatus,
  verbose,
}: Omit<
  LicenseAuditResult,
  "notFound" | "needsUserVerification" | "overrides" | "errorResults"
> & {
  verbose: boolean;
}) {
  const hasWhitelisted = groupedByStatus.whitelist.length > 0;

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <FailureHeaderMessage />
      </Box>
      {hasWhitelisted && (
        <Box>
          <CompliantMessage count={groupedByStatus.whitelist.length} />
        </Box>
      )}
      <Box marginTop={verbose && hasWhitelisted ? 1 : 0}>
        <BlacklistedMessage count={groupedByStatus.blacklist.length} />
      </Box>
      <LicenseList
        detectedLicenses={groupedByStatus.blacklist}
        verbose={verbose}
      />
    </Box>
  );
}
