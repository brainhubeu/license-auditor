import type { licensesData } from "./licenses";

export declare const licenses: (typeof licensesData.licenses)[];
export declare const licenseMap: Map<LicenseId, License>;
export declare type LicenseId =
  (typeof licensesData.licenses)[number]["licenseId"];
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
