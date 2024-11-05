import type { LicenseAuditResult } from "@brainhubeu/license-auditor-data";
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
}: Omit<LicenseAuditResult, "notFound">) {
  const hasWhitelisted = groupedByStatus.whitelist.length > 0;
  const hasBlacklisted = groupedByStatus.blacklist.length > 0;

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        {hasBlacklisted ? <FailureHeaderMessage /> : <WarningHeaderMessage />}
      </Box>
      {hasWhitelisted && (
        <Box>
          <CompliantMessage count={groupedByStatus.whitelist.length} />
        </Box>
      )}
      {hasBlacklisted && (
        <>
          <Box>
            <BlacklistedMessage count={groupedByStatus.blacklist.length} />
          </Box>
          <LicenseList licenses={groupedByStatus.blacklist} />
        </>
      )}
      <Box>
        <UnknownMessage count={groupedByStatus.unknown.length} />
      </Box>
      <LicenseList licenses={groupedByStatus.unknown} />
    </Box>
  );
}
