import { Box, Text, useApp } from "ink";
import SelectInput from "ink-select-input";
import { useEffect, useState } from "react";
import { SpinnerWithLabel } from "../components/spinner-with-label";
import { ConfigType, generateConfig } from "../utils/generate-config";
import { installPackages } from "../utils/install-packages";

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

// todo: allow generating config files other than .js
export default function Init() {
  const { exit } = useApp();
  const [packagesInstalled, setPackagesInstalled] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const handleSelectConfigType = async (item: ConfigTypeItem) => {
    const message = await generateConfig(item.value);
    setResultMessage(message);
    setTimeout(exit, 1500);
  };

  useEffect(() => {
    void installPackages();
    setPackagesInstalled(true);
  }, []);

  if (!packagesInstalled) {
    return <SpinnerWithLabel label="Installing dependencies..." />;
  }

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
