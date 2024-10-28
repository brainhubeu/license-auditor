import { Box, Text } from "ink";
import Spinner from "ink-spinner";

export function SpinnerWithLabel({ label }: { label: string }) {
  return (
    <Box>
      <Spinner />
      <Text>{label}</Text>
    </Box>
  );
}
