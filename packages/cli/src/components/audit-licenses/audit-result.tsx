import type { LicenseAuditResult, LicenseStatus } from "@license-auditor/data";
import { Box } from "ink";
import FailureResult from "./failure-result.js";
import IncludingUnknownResult from "./including-unknown-result.js";
import NoLicensesFoundResult from "./no-licenses-found-result.js";
import NotFoundResult from "./not-found-result.js";
import { OverrideMessage } from "./result-messages.js";
import SuccessResult from "./success-result.js";
import VerboseView from "./verbose-view.js";

function ResultForStatus({ result }: { result: LicenseAuditResult }) {
  const hasWhitelisted = result.groupedByStatus.whitelist.length > 0;
  const hasBlacklisted = result.groupedByStatus.blacklist.length > 0;
  const hasUnknown = result.groupedByStatus.unknown.length > 0;

  switch (true) {
    case hasWhitelisted && !hasBlacklisted && !hasUnknown:
      return (
        <SuccessResult
          whitelistedCount={result.groupedByStatus.whitelist.length}
        />
      );

    case hasBlacklisted && !hasUnknown:
      return <FailureResult groupedByStatus={result.groupedByStatus} />;

    case !(hasWhitelisted || hasBlacklisted || hasUnknown):
      return <NoLicensesFoundResult />;

    default:
      return (
        <IncludingUnknownResult groupedByStatus={result.groupedByStatus} />
      );
  }
}

interface AuditResultProps {
  result: LicenseAuditResult;
  verbose: boolean;
  filter: LicenseStatus | undefined;
}

export default function AuditResult({
  result,
  verbose,
  filter,
}: AuditResultProps) {
  const hasNotFound = result.notFound.size > 0;
  const overrideCount =
    result.excluded.length + Object.keys(result.assigned).length;

  return (
    <Box flexDirection="column">
      {verbose && <VerboseView result={result} filter={filter} />}
      <ResultForStatus result={result} />
      {hasNotFound && <NotFoundResult notFound={result.notFound} />}
      <OverrideMessage count={overrideCount} />
    </Box>
  );
}
