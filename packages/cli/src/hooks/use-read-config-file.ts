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

const formatIssuePath = (path: (string | number)[]) => {
  let formattedPath = "";
  for (const part of path) {
    if (typeof part === "string") {
      formattedPath += `${formattedPath ? "." : ""}${part}`;
    } else {
      formattedPath += `[${part}]`;
    }
  }
  return formattedPath;
};

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

      if (!configFile || configFile.isEmpty) {
        setError({
          message: "Configuration file not found",
          type: ReadConfigErrorType.NotFound,
        });
        return;
      }

      const parsed = ConfigSchema.safeParse(configFile.config);

      if (parsed.error) {
        const { fieldErrors } = parsed.error.flatten((issue) => ({
          path: issue.path,
          message: issue.message,
          code: issue.code,
        }));

        const errorMessage = Object.entries(fieldErrors)
          .filter(([, error]) => error)
          .map(
            ([_, error]) =>
              `${error
                .map(
                  (e) =>
                    `Invalid value in path: ${formatIssuePath(
                      e.path,
                    )} - error "${e.code}". ${e.message}`,
                )
                .join("\n")}`,
          )
          .join("\n");

        setError({
          message: `Invalid configuration file at ${configFile.filepath}.\n${errorMessage}`,
          type: ReadConfigErrorType.Invalid,
        });
        return;
      }

      setConfigFile({
        config: parsed.data,
        filepath: configFile.filepath,
        isEmpty: configFile.isEmpty,
      });
    }
    void assignConfigFile();
  }, [useDefaults]);

  return { configFile, error };
}
