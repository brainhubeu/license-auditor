import type { LicenseAuditResult } from "@license-auditor/data";
import { Box } from "ink";
import React from "react";
import FailureResult from "./failure-result";
import IncludingUnknownResult from "./including-unknown-result";
import NoLicensesFoundResult from "./no-licenses-found-result";
import NotFoundResult from "./not-found-result";
import SuccessResult from "./success-result";

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
}: {
  result: LicenseAuditResult;
}) {
  const auditResultComponent = renderAuditResult(result);
  const hasNotFound = result.notFound.size > 0;

  return (
    <Box flexDirection="column">
      {auditResultComponent}
      {hasNotFound && <NotFoundResult notFound={result.notFound} />}
    </Box>
  );
}
