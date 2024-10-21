import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React from "react";

export function SpinnerWithLabel({ label }: { label: string }) {
  return (
    <Box>
      <Spinner />
      <Text>{label}</Text>
    </Box>
  );
}
