import { Box } from "ink";
import { CompliantMessage, SuccessHeaderMessage } from "./result-messages.js";

interface SuccessResultProps {
  whitelistedCount: number;
}

export default function SuccessResult({
  whitelistedCount,
}: SuccessResultProps) {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <SuccessHeaderMessage />
      </Box>
      <Box>
        <CompliantMessage count={whitelistedCount} />
      </Box>
    </Box>
  );
}
