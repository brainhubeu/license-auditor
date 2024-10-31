import type z from "zod";
import type { ConfigSchema } from "./schemas.js";

export type ConfigType = z.infer<typeof ConfigSchema>;
