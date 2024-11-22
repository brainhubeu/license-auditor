import { Box, Text } from "ink";

export default function AdditionalInfo({ verbose }: { verbose: boolean }) {
  return (
    <Box marginY={1}>
      {!verbose && (
        <Text italic>
          use --verbose flag for more details and paths included in output
        </Text>
      )}
    </Box>
  );
}
