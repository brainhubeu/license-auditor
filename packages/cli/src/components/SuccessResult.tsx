import figures from "figures";
import { Box, Text } from "ink";
import React from "react";
interface SuccessResultProps {
  whitelistedCount: number;
}

export default function SuccessResult({
  whitelistedCount,
}: SuccessResultProps) {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        <Text backgroundColor="green" color="black" bold>
          {` ${figures.tick} LICENSE AUDIT SUCCEEDED `}
        </Text>
      </Box>
      <Box>
        <Text color="green">{figures.pointerSmall}</Text>
        <Text>
          {" "}
          {whitelistedCount} license(s) are compliant with the whitelist.
        </Text>
      </Box>
    </Box>
  );
}
