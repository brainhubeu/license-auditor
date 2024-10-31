import z from "zod";
import { LicenseIdSchema } from "../licenses/schemas.js";

export const ConfigSchema = z.object({
  blacklist: z.array(LicenseIdSchema),
  whitelist: z.array(LicenseIdSchema),
  overrides: z.record(z.string(), LicenseIdSchema),
});
