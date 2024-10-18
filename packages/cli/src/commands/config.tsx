import { Box, Text, useApp } from "ink";
import SelectInput from "ink-select-input";
import React from "react";
import { executeConfig } from "../utils/execute-config.js";

type ConfigOption = "default" | "blank";
type ItemType = { label: string; value: ConfigOption };

const items: ItemType[] = [
  {
    label: "Use default lists",
    value: "default",
  },
  {
    label: "Use blank lists",
    value: "blank",
  },
];

export default function Config() {
  const { exit } = useApp();

  const handleSelect = (item: ItemType) => {
    executeConfig(item.value === "default");
    exit();
  };

  return (
    <Box flexDirection="column">
      <Text>
        Would you like to use the default license whitelist and banlist or
        configure your own?
      </Text>
      <SelectInput items={items} onSelect={handleSelect} />
    </Box>
  );
}
