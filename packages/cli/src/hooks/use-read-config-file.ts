import { ConfigSchema } from "@license-auditor/data";
import { useEffect, useState } from "react";
import { z } from "zod";
import { readConfiguration } from "../utils/read-configuration.js";
import { readDefaultConfig } from "../utils/read-default-config.js";

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

interface UseReadConfigurationProps {
  useDefaults?: boolean;
}

export function useReadConfiguration({
  useDefaults,
}: UseReadConfigurationProps) {
  const [configFile, setConfigFile] = useState<ConfigFileType>();
  const [error, setError] = useState<ReadConfigurationError | null>(null);

  useEffect(() => {
    async function assignConfigFile() {
      if (useDefaults) {
        const { config, templateDir } = await readDefaultConfig();

        setConfigFile({
          config,
          filepath: templateDir,
        });
        return;
      }

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
  }, [useDefaults]);

  return { configFile, error };
}
