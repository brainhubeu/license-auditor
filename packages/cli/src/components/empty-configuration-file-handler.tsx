import { Box, Text } from "ink";
import type { ConfigFileType } from "../hooks/use-read-config-file.js";
import SelectInput from "ink-select-input";
import { booleanSelectItems } from "../utils/boolean-select-items.js";
import { useState } from "react";
import Init from "../commands/init.js";

interface EmptyConfigurationFileHandlerProps {
  configFile: ConfigFileType;
}

export function EmptyConfigFileHandler({
  configFile,
}: EmptyConfigurationFileHandlerProps) {
  const [shouldFillConfig, setShouldFillConfig] = useState(false);

  if (shouldFillConfig) {
    return <Init />;
  }

  return (
    <Box flexDirection="column">
      <Text>
        Configuration file found in {configFile.filepath}, but it's empty.
      </Text>
      <Text>Would you like to fill it now? (Y/n)</Text>
      <SelectInput
        items={booleanSelectItems}
        onSelect={(item) => setShouldFillConfig(item.value)}
      />
    </Box>
  );
}
