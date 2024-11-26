import type z from "zod";
import type {
  ConfigSchema,
  OverridesSchema,
  SeveritySchema,
} from "./schemas.js";

export type ConfigType = z.infer<typeof ConfigSchema>;
export type OverridesType = z.infer<typeof OverridesSchema>;
export type Severity = z.infer<typeof SeveritySchema>;
