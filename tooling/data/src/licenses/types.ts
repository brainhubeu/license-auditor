import type { z } from "zod";
import type { LicenseIdSchema, LicenseSchema } from "./schemas.js";

export type LicenseId = z.infer<typeof LicenseIdSchema>;

export type License = z.infer<typeof LicenseSchema>;

export type LicenseStatus = "whitelist" | "blacklist" | "unknown";
