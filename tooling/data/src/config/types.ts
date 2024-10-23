import type z from "zod";
import type { ConfigSchema } from "./schemas";

export type ConfigType = z.infer<typeof ConfigSchema>;
