import { useApp } from "ink";
import { useEffect } from "react";
import { type EnvType, envSchema } from "../../env.js";
import { SpinnerWithLabel } from "../spinner-with-label.js";

import { InvalidEnvironmentVariablesException } from "@brainhubeu/license-auditor-core";

interface ValidateEnvProps {
  onSuccess: (env: EnvType) => void;
}

export function ValidateEnv({ onSuccess }: ValidateEnvProps) {
  const { exit } = useApp();

  useEffect(() => {
    const parsedEnv = envSchema.safeParse(process.env);

    if (parsedEnv.error) {
      exit(
        new InvalidEnvironmentVariablesException(
          "Failed to parse environment variables",
          {
            originalError: parsedEnv.error,
          },
        ),
      );
    }

    if (parsedEnv.success) {
      onSuccess(parsedEnv.data);
    }
  }, [onSuccess, exit]);

  return <SpinnerWithLabel label="Verifying environment variables..." />;
}
