import type { LicenseAuditResult } from "@brainhubeu/license-auditor-core";
import figures from "figures";
import { Box, Text } from "ink";
import { getResults, hasResults } from "../utils/get-results";
import FailureResult from "./failure-result";
import IncludingUnknownResult from "./including-unknown-result";
import SuccessResult from "./success-result";

function renderAuditResult(result: LicenseAuditResult) {
  const hasWhitelisted = hasResults({ result, status: "whitelist" });
  const hasBlacklisted = hasResults({ result, status: "blacklist" });
  const hasUnknown = hasResults({ result, status: "unknown" });

  const whitelistedCount = getResults({ result, status: "whitelist" }).length;

  switch (true) {
    case hasWhitelisted && !hasBlacklisted && !hasUnknown:
      return <SuccessResult whitelistedCount={whitelistedCount} />;

    case hasBlacklisted && !hasUnknown:
      return <FailureResult groupedByStatus={result.groupedByStatus} />;

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
  const describePackagesCount =
    result.notFound.size === 1 ? "package is" : "packages are";

  return (
    <Box flexDirection="column">
      {auditResultComponent}
      {hasNotFound && (
        <Box flexDirection="column">
          <Box>
            <Text color="yellow">{figures.warning}</Text>
            <Text>
              {result.notFound.size} {describePackagesCount} missing license
              information:
            </Text>
          </Box>
          <Box flexDirection="column" marginLeft={2}>
            {Array.from(result.notFound).map((packageName) => (
              <Box key={packageName}>
                <Text color="gray">{figures.pointerSmall}</Text>
                <Text> {packageName}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
