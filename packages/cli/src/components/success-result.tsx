import figures from "figures";
import { Box, Text } from "ink";
import React from "react";
import { describeLicenseCount } from "../utils/describe-license-count.js";

interface SuccessResultProps {
  whitelistedCount: number;
}

export default function SuccessResult({
  whitelistedCount,
}: SuccessResultProps) {
  const whitelistResultText = describeLicenseCount(whitelistedCount);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        <Text backgroundColor="green" color="black" bold>
          {` ${figures.tick} LICENSE AUDIT SUCCEEDED `}
        </Text>
      </Box>
      <Box>
        <Text color="green">{figures.pointerSmall}</Text>
        <Text> {whitelistResultText} compliant with the whitelist.</Text>
      </Box>
    </Box>
  );
}
