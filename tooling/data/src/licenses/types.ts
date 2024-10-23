import type { z } from "zod";
import type { LicenseIdSchema, LicenseSchema } from "./schemas";

export type LicenseId = z.infer<typeof LicenseIdSchema>;

export type License = z.infer<typeof LicenseSchema>;
