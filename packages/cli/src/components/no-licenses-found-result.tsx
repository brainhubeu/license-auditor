import figures from "figures";
import { Box, Text } from "ink";
import React from "react";
import { WarningHeaderMessage } from "./result-messages.js";

export default function NoLicensesFoundResult() {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1} marginTop={1}>
        <WarningHeaderMessage />
      </Box>
      <Box>
        <Text color="yellow">{figures.warning}</Text>
        <Text>
          No licenses found. If this is unexpected, please check your
          configuration file.
        </Text>
      </Box>
    </Box>
  );
}
