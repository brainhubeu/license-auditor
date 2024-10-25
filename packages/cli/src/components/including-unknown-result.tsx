import type { LicenseAuditResult } from "@brainhubeu/license-auditor-core";
import figures from "figures";
import { Box, Text } from "ink";
import { describeLicenseCount } from "../utils/describe-license-count";
import { getResults, hasResults } from "../utils/get-results";
import LicenseList from "./license-list";

export default function IncludingUnknownResult({
  groupedByStatus,
}: Omit<LicenseAuditResult, "notFound">) {
  const noLicensesFound = ![
    hasResults({ result: { groupedByStatus }, status: "whitelist" }),
    hasResults({ result: { groupedByStatus }, status: "blacklist" }),
    hasResults({ result: { groupedByStatus }, status: "unknown" }),
  ].some(Boolean);

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

  const hasBlacklisted = hasResults({
    result: { groupedByStatus },
    status: "blacklist",
  });

  const statusText = hasBlacklisted ? "FAILED" : "WARNING";
  const headerColor = hasBlacklisted ? "red" : "yellow";

  const whitelistResultText = describeLicenseCount(
    getResults({ result: { groupedByStatus }, status: "whitelist" }).length,
  );
  const blacklistedResultText = describeLicenseCount(
    getResults({ result: { groupedByStatus }, status: "blacklist" }).length,
  );
  const unknownResultText = describeLicenseCount(
    getResults({ result: { groupedByStatus }, status: "unknown" }).length,
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
          <LicenseList
            licenses={getResults({
              result: { groupedByStatus },
              status: "blacklist",
            })}
          />
        </>
      )}
      <Box>
        <Text color="yellow">{figures.warning}</Text>
        <Text>{unknownResultText} unknown:</Text>
      </Box>
      <LicenseList
        licenses={getResults({
          result: { groupedByStatus },
          status: "blacklist",
        })}
      />
    </Box>
  );
}
