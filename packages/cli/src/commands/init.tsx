import figures from "figures";
import { Text, useApp } from "ink";
import React, { useEffect, useState } from "react";
import SelectExtension from "../components/init/select-extension";
import SelectListType from "../components/init/select-list-type";
import { SpinnerWithLabel } from "../components/spinner-with-label";
import type { ConfigExtension } from "../constants/config-constants";
import { type ConfigType, generateConfig } from "../utils/generate-config";
import { installPackages } from "../utils/install-packages";

export const isDefault = true;

export default function Init() {
  const { exit } = useApp();
  const [packagesInstalled, setPackagesInstalled] = useState(false);
  const [listType, setListType] = useState<ConfigType | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isGeneratingConfig, setIsGeneratingConfig] = useState(false);

  useEffect(() => {
    void installPackages();
    setPackagesInstalled(true);
  }, []);

  if (!packagesInstalled) {
    return <SpinnerWithLabel label="Installing dependencies..." />;
  }

  if (isGeneratingConfig) {
    return <SpinnerWithLabel label="Generating configuration file..." />;
  }

  if (resultMessage) {
    return (
      <Text color="green">
        {figures.tick} {resultMessage}
      </Text>
    );
  }

  if (!listType) {
    return <SelectListType onConfigTypeSelected={setListType} />;
  }

  if (listType) {
    const onExtensionSelected = async (extension: ConfigExtension) => {
      setIsGeneratingConfig(true);
      const message = await generateConfig(listType, extension);
      setResultMessage(message);
      setIsGeneratingConfig(false);
      setTimeout(exit, 1500);
    };

    return <SelectExtension onExtensionSelected={onExtensionSelected} />;
  }

  return null;
}
