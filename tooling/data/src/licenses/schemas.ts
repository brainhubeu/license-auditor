import { z } from "zod";
import { licensesData } from "./licenses";

export const licenses = licensesData.licenses;
export const licenseMap = new Map(
  licenses.map((license) => [license.licenseId, license]),
);

// https://github.com/colinhacks/zod/issues/3651#issuecomment-2236638517
export const LicenseIdSchema = z.union([
  z.literal(licenses[0].licenseId),
  z.literal(licenses[1].licenseId),
  ...licenses.slice(2).map(({ licenseId }) => z.literal(licenseId)),
]);

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