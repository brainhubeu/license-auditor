import z from "zod";
import { LicenseIdSchema } from "../licenses/schemas.js";

export const OverridesSchema = z.object({
  warn: z.array(z.string()).optional(),
  off: z.array(z.string()).optional(),
});

export const ConfigSchema = z.object({
  blacklist: z.array(LicenseIdSchema),
  whitelist: z.array(LicenseIdSchema),
  overrides: OverridesSchema.optional(),
});
