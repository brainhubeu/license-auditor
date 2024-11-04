import figures from "figures";
import { Text, useApp } from "ink";
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
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  useEffect(() => {
    const callGenerateConfig = async () => {
      const message = await generateConfig(configListType, extension, dir);
      setResultMessage(message);
      setTimeout(exit, 1500);
    };
    void callGenerateConfig();
  }, [configListType, extension, dir, exit]);

  if (resultMessage) {
    return (
      <Text color="green">
        {figures.tick} {resultMessage}
      </Text>
    );
  }

  return <SpinnerWithLabel label="Generating configuration file..." />;
}
