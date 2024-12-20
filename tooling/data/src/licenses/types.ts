import type { z } from "zod";
import type { LICENSE_SOURCE } from "./constants.js";
import type {
  LicenseIdSchema,
  LicenseSchema,
  LicenseStatusSchema,
  VerificationStatusSchema,
} from "./schemas.js";

export type LicenseId = z.infer<typeof LicenseIdSchema>;

export type License = z.infer<typeof LicenseSchema>;

export type LicenseSource =
  (typeof LICENSE_SOURCE)[keyof typeof LICENSE_SOURCE];

export type LicenseWithSource = License & {
  source: LicenseSource;
  licensePath: string;
};

export type LicenseStatus = z.infer<typeof LicenseStatusSchema>;

export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;
