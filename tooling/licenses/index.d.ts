import type { licensesData } from "./licenses.ts";

export declare const licenses: (typeof licensesData.licenses)[];
export declare type LicenseId =
  (typeof licensesData.licenses)[number]["licenseId"];
export declare const licenseMap: Map<LicenseId, License>;
interface License {
  reference: string;
  isDeprecatedLicenseId: boolean;
  detailsUrl: string;
  referenceNumber: number;
  name: string;
  licenseId: LicenseId;
  seeAlso: string[];
  isOsiApproved: boolean;
}
