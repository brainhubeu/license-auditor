import { useApp } from "ink";
import { envSchema, type EnvType } from "../../env.js";
import { useEffect } from "react";
import { SpinnerWithLabel } from "../spinner-with-label.js";

interface ValidateEnvProps {
  onSuccess: (env: EnvType) => void;
}

export function ValidateEnv({ onSuccess }: ValidateEnvProps) {
  const { exit } = useApp();

  useEffect(() => {
    const parsedEnv = envSchema.safeParse(process.env);

    if (parsedEnv.error) {
      exit(new Error(parsedEnv.error.message));
    }

    if (parsedEnv.success) {
      onSuccess(parsedEnv.data);
    }
  }, [onSuccess, exit]);

  return <SpinnerWithLabel label="Verifying environment variables..." />;
}
