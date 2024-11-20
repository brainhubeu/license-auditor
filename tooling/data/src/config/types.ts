import type z from "zod";
import type { ConfigSchema, OverridesSchema } from "./schemas.js";

export type ConfigType = z.infer<typeof ConfigSchema>;
export type OverridesType = z.infer<typeof OverridesSchema>;
