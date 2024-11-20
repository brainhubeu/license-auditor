import z from "zod";
import { LicenseIdSchema } from "../licenses/schemas.js";

export const OverridesSchema = z.object({
  assignments: z.record(z.string(), LicenseIdSchema).optional(),
  excluded: z.array(z.string()).optional(),
});

export const ConfigSchema = z.object({
  blacklist: z.array(LicenseIdSchema),
  whitelist: z.array(LicenseIdSchema),
  overrides: OverridesSchema.optional(),
});
