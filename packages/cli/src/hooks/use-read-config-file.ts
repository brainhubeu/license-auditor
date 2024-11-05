import { ConfigSchema } from "@brainhubeu/license-auditor-data";
import { useEffect, useState } from "react";
import { z } from "zod";
import { readConfiguration } from "../utils/read-configuration.js";

const ConfigFileSchema = z.object({
  config: ConfigSchema,
  isEmpty: z.boolean().optional(),
  filepath: z.string(),
});

type ConfigFileType = z.infer<typeof ConfigFileSchema>;

export function useReadConfiguration() {
  const [configFile, setConfigFile] = useState<ConfigFileType>();

  useEffect(() => {
    async function assignConfigFile() {
      const configFile = await readConfiguration();
      // todo: handle configFile.isEmpty case
      const parsed = ConfigFileSchema.safeParse(configFile);
      if (parsed.error) {
        throw new Error(`Invalid configuration file: ${parsed.error}`);
      }
      setConfigFile(parsed.data);
    }
    void assignConfigFile();
  }, []);

  return { configFile };
}
