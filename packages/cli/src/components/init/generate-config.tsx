import figures from "figures";
import { Box, Text, useApp } from "ink";
import { useEffect, useState } from "react";
import type { ConfigExtension } from "../../constants/config-constants.js";
import {
  type ConfigListType,
  generateConfig,
} from "../../utils/generate-config.js";
import { SpinnerWithLabel } from "../spinner-with-label.js";

interface GenerateConfigProps {
  configListType: ConfigListType;
  extension: ConfigExtension;
  dir: string;
}

export function GenerateConfig({
  configListType,
  extension,
  dir,
}: GenerateConfigProps) {
  const { exit } = useApp();
  const [configGenerated, setConfigGenerated] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  useEffect(() => {
    const callGenerateConfig = async () => {
      const result = await generateConfig(configListType, extension, dir);
      if (result.success) {
        setConfigGenerated(true);
      } else {
        setError(result.error);
      }
      setTimeout(exit, 1500);
    };
    void callGenerateConfig();
  }, [configListType, extension, dir, exit]);

  if (error) {
    return (
      <Box flexDirection="column">
        <Text color="red">
          {figures.cross} Failed to generate configuration file
        </Text>
        <Text color="red">{error.message}</Text>
      </Box>
    );
  }

  if (configGenerated) {
    return (
      <Text color="green">
        {figures.tick} Configured license-auditor with {configListType} license
        whitelist and blacklist at: {dir}/license-auditor.config{extension}
      </Text>
    );
  }

  return <SpinnerWithLabel label="Generating configuration file..." />;
}
