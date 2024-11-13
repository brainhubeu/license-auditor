import { ConfigSchema } from "@license-auditor/data";
import { useEffect, useState } from "react";
import { z } from "zod";
import { readConfiguration } from "../utils/read-configuration.js";

const ConfigFileSchema = z.object({
  config: ConfigSchema,
  filepath: z.string(),
});

type ConfigFileType = z.infer<typeof ConfigFileSchema>;

enum ReadConfigurationErrorType {
  NotFound = 0,
  Invalid = 1,
  Empty = 2,
}

interface ReadConfigurationError {
  message: string;
  type: ReadConfigurationErrorType;
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
          type: ReadConfigurationErrorType.NotFound,
        });
        return;
      }

      if (configFile.isEmpty) {
        setError({
          message: "Configuration file is empty",
          type: ReadConfigurationErrorType.Empty,
        });
        return;
      }

      const parsed = ConfigFileSchema.safeParse(configFile);
      if (parsed.error) {
        setError({
          message: `Invalid configuration file at ${configFile.filepath}: ${parsed.error}`,
          type: ReadConfigurationErrorType.Invalid,
        });
        return;
      }

      setConfigFile(parsed.data);
    }
    void assignConfigFile();
  }, []);

  return { configFile, error };
}
