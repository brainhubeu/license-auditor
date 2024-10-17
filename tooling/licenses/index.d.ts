import type { licensesData } from "./licenses";

export declare const licenses: (typeof licensesData.licenses)[];
export declare const licenseMap: Map<LicenseId, License>;
export declare const licenseIdsSet: Set<LicenseId>;
export declare type License = (typeof licensesData.licenses)[number];
export declare type LicenseId = License["licenseId"];
