import type z from "zod";
import type { ConfigSchema, OverridesSchema, Severity } from "./schemas.js";

export type ConfigType = z.infer<typeof ConfigSchema>;
export type OverridesType = z.infer<typeof OverridesSchema>;
export type SeverityType = z.infer<typeof Severity>;
