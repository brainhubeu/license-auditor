import type {
  ConfigType,
  LicenseAuditResult,
  LicenseStatus,
} from "@license-auditor/data";
import { Box } from "ink";
import { OverrideResult } from "../override-result.js";
import ErrorBox from "./error-box.js";
import FailureResult from "./failure-result.js";
import IncludingUnknownResult from "./including-unknown-result.js";
import NeedsUserVerificationResult from "./needs-user-verification-result.js";
import NoLicensesFoundResult from "./no-licenses-found-result.js";
import NotFoundResult from "./not-found-result.js";
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
  warning?: string | null;
  overrides: Pick<ConfigType, "overrides">["overrides"];
}

export default function AuditResult({
  result,
  verbose,
  filter,
  warning,
  overrides,
}: AuditResultProps) {
  const hasNotFound = result.notFound.size > 0;
  const hasNeedsUserVerification = result.needsUserVerification.size > 0;

  return (
    <Box flexDirection="column">
      {verbose && <VerboseView result={result} filter={filter} />}
      <ResultForStatus result={result} />
      {hasNotFound && <NotFoundResult notFound={result.notFound} />}
      {warning && <ErrorBox color="yellow">{warning}</ErrorBox>}
      {verbose && (
        <OverrideResult
          configOverrides={overrides}
          resultOverrides={result.overrides}
        />
      )}
      {hasNeedsUserVerification && (
        <NeedsUserVerificationResult
          needsUserVerification={result.needsUserVerification}
        />
      )}
    </Box>
  );
}
