import figures from "figures";
import { Box, Text } from "ink";
import { pluralize } from "../../utils/pluralize.js";

type ResultsListProps = {
  message: [string, string];
  results: { packageName: string; licenses: string[]; message: string }[];
  type: "ok" | "warning" | "error";
  renderMessages: boolean;
};

const ICONS = {
  ok: <Text color="green">{figures.tick}</Text>,
  warning: <Text color="yellow">{figures.warning}</Text>,
  error: <Text color="red">{figures.cross}</Text>,
};

export default function ResultsList({
  message,
  results,
  type,
  renderMessages,
}: ResultsListProps) {
  const pluralizedMessage = pluralize(results.length, message[0], message[1]);

  return (
    <Box flexDirection="column">
      <Box>
        {ICONS[type]}
        <Text>{` ${pluralizedMessage}`}:</Text>
      </Box>
      <Box flexDirection="column" marginLeft={2}>
        {results.map(({ packageName, message }) => (
          <Box key={packageName} marginBottom={renderMessages ? 1 : 0}>
            <Text color="gray">{figures.pointerSmall}</Text>
            {renderMessages ? (
              <Text> {message} </Text>
            ) : (
              <Text> {packageName} </Text>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
