import { ConfigSchema } from "@license-auditor/data";
import { useEffect, useState } from "react";
import { z } from "zod";
import { readConfiguration } from "../utils/read-configuration.js";

const ConfigFileSchema = z.object({
  config: ConfigSchema,
  isEmpty: z.boolean().optional(),
  filepath: z.string(),
});

export type ConfigFileType = z.infer<typeof ConfigFileSchema>;

export enum ReadConfigErrorType {
  NotFound = 0,
  Invalid = 1,
}

export interface ReadConfigurationError {
  message: string;
  type: ReadConfigErrorType;
}

export function useReadConfiguration() {
  const [configFile, setConfigFile] = useState<ConfigFileType>();
  const [error, setError] = useState<ReadConfigurationError | null>(null);

  useEffect(() => {
    async function assignConfigFile() {
      const configFile = await readConfiguration();

      if (!configFile) {
        setError({
          message: "Configuration file not found",
          type: ReadConfigErrorType.NotFound,
        });
        return;
      }

      const parsed = ConfigFileSchema.safeParse(configFile);
      if (parsed.error) {
        setError({
          message: `Invalid configuration file at ${configFile.filepath}: ${parsed.error.message}`,
          type: ReadConfigErrorType.Invalid,
        });
      }

      setConfigFile(parsed.data);
    }
    void assignConfigFile();
  }, []);

  return { configFile, error };
}
