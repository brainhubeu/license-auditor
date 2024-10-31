import { useApp } from "ink";
import { envSchema, type EnvType } from "../../env.js";

interface ValidateEnvProps {
  onSuccess: (env: EnvType) => void;
}

export function ValidateEnv({ onSuccess }: ValidateEnvProps) {
  const { exit } = useApp();
  const parsedEnv = envSchema.safeParse(process.env);

  if (parsedEnv.error) {
    exit(new Error(parsedEnv.error.message));
  }

  if (parsedEnv.success) {
    onSuccess(parsedEnv.data);
  }

  return null;
}
