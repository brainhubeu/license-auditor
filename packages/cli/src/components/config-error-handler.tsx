import { Box, Text } from "ink";
import {
  ReadConfigErrorType,
  type ReadConfigurationError,
} from "../hooks/use-read-config-file.js";
import Init from "../commands/init.js";
import { useState } from "react";
import SelectInput from "ink-select-input";
import { booleanSelectItems } from "../utils/boolean-select-items.js";

interface ReadConfigurationErrorProps {
  error: ReadConfigurationError;
}

export function ConfigErrorHandler({ error }: ReadConfigurationErrorProps) {
  switch (error.type) {
    case ReadConfigErrorType.NotFound:
      return <ConfigFileNotFoundHandler message={error.message} />;
    default:
      return <Text>{error.message}</Text>;
  }
}

function ConfigFileNotFoundHandler({ message }: { message: string }) {
  const [shouldCreateConfig, setShouldCreateConfig] = useState(false);

  if (shouldCreateConfig) {
    return <Init />;
  }

  return (
    <Box flexDirection="column">
      <Text>{message}</Text>
      <Text>Would you like to create a configuration file now? (Y/n)</Text>
      <SelectInput
        items={booleanSelectItems}
        onSelect={(item) => setShouldCreateConfig(item.value)}
      />
    </Box>
  );
}
