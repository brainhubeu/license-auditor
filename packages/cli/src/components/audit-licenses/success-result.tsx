import { Box } from "ink";
import {
  CompliantMessage,
  OverrideMessage,
  SuccessHeaderMessage,
} from "./result-messages.js";

interface SuccessResultProps {
  whitelistedCount: number;
  overrideCount: number;
}

export default function SuccessResult({
  whitelistedCount,
  overrideCount,
}: SuccessResultProps) {
  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <SuccessHeaderMessage />
      </Box>
      <Box>
        <CompliantMessage count={whitelistedCount} />
      </Box>
      {overrideCount > 0 ? (
        <Box>
          <OverrideMessage count={overrideCount} />
        </Box>
      ) : null}
    </Box>
  );
}
