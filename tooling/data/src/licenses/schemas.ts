import { z } from "zod";
import { licensesData } from "./licenses.js";

import { findBestMatch } from "string-similarity";

export const licenses = licensesData.licenses;
const licenseIds = licenses.map(({ licenseId }) => licenseId);
export const licenseMap = new Map(
  licenses.map((license) => [license.licenseId, license]),
);

// https://github.com/colinhacks/zod/issues/3651#issuecomment-2236638517
export const LicenseIdSchema = z.union(
  [
    z.literal(licenseIds[0] ?? "0BSD"),
    z.literal(licenseIds[1] ?? "3D-Slicer-1.0"),
    ...licenseIds.slice(2).map((licenseId) => z.literal(licenseId)),
  ],
  {
    errorMap: (issue, ctx) => {
      const value = ctx.data;
      if (
        issue.code === z.ZodIssueCode.invalid_union &&
        typeof value === "string"
      ) {
        const bestMatch = findBestMatch(
          value,
          licenses.map(({ licenseId }) => licenseId),
        );

        return {
          message: `Invalid license with value: ${value}. Did you mean: ${bestMatch.bestMatch.target}?`,
        };
      }
      return { message: `Invalid license with value: ${value}.` };
    },
  },
);

export const LicenseSchema = z.object({
  reference: z.string().url(),
  isDeprecatedLicenseId: z.boolean(),
  detailsUrl: z.string().url(),
  referenceNumber: z.number(),
  name: z.string(),
  licenseId: LicenseIdSchema,
  seeAlso: z.array(z.string().url()),
  isOsiApproved: z.boolean(),
});

export const LicenseStatusSchema = z.union([
  z.literal("whitelist"),
  z.literal("blacklist"),
  z.literal("unknown"),
]);

export const VerificationStatusSchema = z.union([
  z.literal("ok"),
  z.literal("someButNotAllLicensesWhitelisted"),
  z.literal("licenseFilesExistButSomeAreUncertain"),
  z.literal("licenseFileExistsButUnknownLicense"),
  z.literal("licenseFileNotFound"),
]);
