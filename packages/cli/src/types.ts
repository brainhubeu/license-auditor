import { ConfigSchema } from "@license-auditor/data";
import type z from "zod";

const Config = ConfigSchema;
type ConfigType = z.infer<typeof Config>;

export type { ConfigType };
