import { useEffect, useState } from "react";
import { readConfiguration } from "../utils/read-configuration.js";

export function useReadConfiguration() {
  // todo: handle types
  // biome-ignore lint/suspicious/noExplicitAny: will be revisited once zod schema is implemented
  const [configFile, setConfigFile] = useState<any>();

  useEffect(() => {
    async function assignConfigFile() {
      const configFile = await readConfiguration();
      setConfigFile(configFile);
    }
    void assignConfigFile();
  }, []);

  return { configFile };
}
