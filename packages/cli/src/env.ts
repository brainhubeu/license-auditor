import { z } from "zod";

export const envSchema = z.object({
  // biome-ignore lint/style/useNamingConvention: this is a constant
  ROOT_DIR: z.string().min(1).default(process.cwd()),
});

export type EnvType = z.infer<typeof envSchema>;
