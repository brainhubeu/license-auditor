import { Box, Spacer, Text } from "ink";
import SelectInput from "ink-select-input";
import React from "react";
import { ConfigExtension } from "../../constants/config-constants";
import type { SelectItem } from "../../constants/select-constants";

const configExtensionItems: SelectItem<ConfigExtension>[] = Object.entries(
  ConfigExtension,
).map(([key, value]) => ({
  label: key,
  value,
}));

interface SelectExtensionProps {
  onExtensionSelected: (configType: ConfigExtension) => void;
}

export default function SelectExtension({
  onExtensionSelected,
}: SelectExtensionProps) {
  return (
    <Box flexDirection="column">
      <Text>
        Which file extension would you like to use for your configuration file?
      </Text>
      <Spacer />
      <Text color="grey">
        .yml or .yaml are also supported, but require creating the file manually
      </Text>
      <SelectInput
        items={configExtensionItems}
        onSelect={(item) => onExtensionSelected(item.value)}
      />
    </Box>
  );
}
