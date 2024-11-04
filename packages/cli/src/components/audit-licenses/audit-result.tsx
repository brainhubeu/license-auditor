import type { LicenseAuditResult } from "@license-auditor/data";
import { Box } from "ink";
import FailureResult from "./failure-result.js";
import IncludingUnknownResult from "./including-unknown-result.js";
import NoLicensesFoundResult from "./no-licenses-found-result.js";
import NotFoundResult from "./not-found-result.js";
import SuccessResult from "./success-result.js";
import VerboseView from "./verbose-view/verbose-view.js";

function renderAuditResult(result: LicenseAuditResult) {
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

export default function AuditResult({
  result,
  verbose = false,
}: {
  result: LicenseAuditResult;
  verbose?: boolean;
}) {
  const auditResultComponent = renderAuditResult(result);
  const hasNotFound = result.notFound.size > 0;

  return (
    <Box flexDirection="column">
      {verbose && <VerboseView result={result} />}
      {auditResultComponent}
      {hasNotFound && <NotFoundResult notFound={result.notFound} />}
    </Box>
  );
}
