import z from "zod";
import { LicenseIdSchema } from "../licenses/schemas.js";

export const SeveritySchema = z.union([z.literal("warn"), z.literal("off")]);
export const OverridesSchema = z.record(z.string(), SeveritySchema);

export const ConfigSchema = z.object({
  blacklist: z.array(LicenseIdSchema),
  whitelist: z.array(LicenseIdSchema),
  overrides: OverridesSchema.optional(),
});
