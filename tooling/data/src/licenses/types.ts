import type { z } from "zod";
import type {
  LicenseIdSchema,
  LicenseSchema,
  LicenseStatusSchema,
  VerificationStatusSchema,
} from "./schemas.js";

export type LicenseId = z.infer<typeof LicenseIdSchema>;

export type License = z.infer<typeof LicenseSchema>;

export type LicenseStatus = z.infer<typeof LicenseStatusSchema>;

export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;
