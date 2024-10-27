import { Box } from "ink";
import React from "react";
import { CompliantMessage, SuccessHeaderMessage } from "./result-messages";

interface SuccessResultProps {
  whitelistedCount: number;
}

export default function SuccessResult({
  whitelistedCount,
}: SuccessResultProps) {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        <SuccessHeaderMessage />
      </Box>
      <Box>
        <CompliantMessage count={whitelistedCount} />
      </Box>
    </Box>
  );
}
