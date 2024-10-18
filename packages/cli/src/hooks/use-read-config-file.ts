import { useEffect, useState } from "react";
import { readConfiguration } from "../utils/read-configuration.js";

export function useReadConfiguration() {
  const [isRetrievingConfig, setIsRetrievingConfig] = useState(true);
  // todo: handle types
  // biome-ignore lint/suspicious/noExplicitAny: will be revisited once zod schema is implemented
  const [configFile, setConfigFile] = useState<any>();

  useEffect(() => {
    setIsRetrievingConfig(true);
    async function assignConfigFile() {
      const configFile = await readConfiguration();
      setConfigFile(configFile);
      setIsRetrievingConfig(false);
    }
    void assignConfigFile();
  }, []);

  return { isRetrievingConfig, configFile };
}
