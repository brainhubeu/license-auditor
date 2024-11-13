import { Box, Text, useApp } from "ink";
import {
  ReadConfigErrorType,
  type ReadConfigurationError,
} from "../hooks/use-read-config-file.js";
import Init from "../commands/init.js";
import { useState } from "react";
import SelectInput from "ink-select-input";
import type { SelectItem } from "../constants/select-constants.js";

interface ReadConfigurationErrorProps {
  error: ReadConfigurationError;
}

export const booleanSelectItems: SelectItem<boolean>[] = [
  {
    label: "Yes",
    value: true,
  },
  {
    label: "No",
    value: false,
  },
] as const;

export function ConfigErrorHandler({ error }: ReadConfigurationErrorProps) {
  switch (error.type) {
    case ReadConfigErrorType.NotFound:
      return <ConfigFileNotFoundHandler message={error.message} />;
    default:
      return <Text>{error.message}</Text>;
  }
}

function ConfigFileNotFoundHandler({ message }: { message: string }) {
  const { exit } = useApp();
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
        onSelect={(item) => {
          if (!item.value) {
            exit();
          }
          setShouldCreateConfig(item.value);
        }}
      />
    </Box>
  );
}
