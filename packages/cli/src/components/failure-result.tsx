import type { LicenseAuditResult } from "@brainhubeu/license-auditor-core";
import figures from "figures";
import { Box, Text } from "ink";
import { describeLicenseCount } from "../utils/describe-license-count";
import { getResults } from "../utils/get-results";
import LicenseList from "./license-list";

export default function FailureResult({
  groupedByStatus,
}: Omit<LicenseAuditResult, "notFound">) {
  const whitelistResultText = describeLicenseCount(
    getResults({ result: { groupedByStatus }, status: "whitelist" })?.length ??
      0,
  );

  const blackListed = getResults({
    result: { groupedByStatus },
    status: "blacklist",
  });

  const blacklistedResultText = describeLicenseCount(blackListed.length);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        <Text backgroundColor="red" color="white" bold>
          {` ${figures.cross} LICENSE AUDIT FAILED `}
        </Text>
      </Box>
      <Box>
        <Text color="green">{figures.tick}</Text>
        <Text>{whitelistResultText} compliant</Text>
      </Box>
      <Box>
        <Text color="red">{figures.cross}</Text>
        <Text> {blacklistedResultText} blacklisted:</Text>
      </Box>
      <LicenseList licenses={blackListed} />
    </Box>
  );
}
