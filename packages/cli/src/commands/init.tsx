import { Box, Text, useApp } from "ink";
import SelectInput from "ink-select-input";
import React, { useState } from "react";
import { ConfigType, executeConfig } from "../utils/execute-config.js";

type ConfigTypeItem = { label: string; value: ConfigType };

const configTypeItems: ConfigTypeItem[] = [
  {
    label: "Use default lists",
    value: ConfigType.Default,
  },
  {
    label: "Use blank lists",
    value: ConfigType.Blank,
  },
] as const;

// todo: allow generating config files other than .js -> refer to supportedExtensions
export default function Init() {
  const { exit } = useApp();
  const [resultMessage, setResultMessage] = useState("");

  const handleSelectConfigType = async (item: ConfigTypeItem) => {
    const message = await executeConfig(item.value);
    setResultMessage(message);
    setTimeout(exit, 1500);
  };

  if (resultMessage) {
    return <Text>{resultMessage}</Text>;
  }

  return (
    <Box flexDirection="column">
      <Text>
        Would you like to use the default license whitelist and banlist or
        configure your own?
      </Text>
      <SelectInput items={configTypeItems} onSelect={handleSelectConfigType} />
    </Box>
  );
}
