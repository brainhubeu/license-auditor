import type { LicenseAuditResult } from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";
import { describeLicenseCount } from "./result-messages.js";

export default function NeedsUserVerificationResult({
  needsUserVerification,
  verbose,
}: Omit<LicenseAuditResult, "notFound" | "groupedByStatus"> & {
  verbose: boolean;
}) {
  const describePackagesCount = describeLicenseCount(
    needsUserVerification.size,
    "package is",
    "packages are",
  );

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="yellow">{figures.warning}</Text>
        <Text>{describePackagesCount} requiring manual checking:</Text>
      </Box>
      <Box flexDirection="column" marginLeft={2}>
        {Array.from(needsUserVerification).map(
          ([packageName, { verificationMessage }]) => (
            <Box key={packageName}>
              <Text color="gray">{figures.pointerSmall}</Text>
              {verbose ? (
                <Text>{verificationMessage}</Text>
              ) : (
                <Text>{packageName}</Text>
              )}
            </Box>
          ),
        )}
      </Box>
    </Box>
  );
}
