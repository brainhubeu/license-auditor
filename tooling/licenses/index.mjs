import licensesData from "./licenses";

export const licenses = licensesData.licenses;
export const licenseMap = new Map(
  licenses.map((license) => [license.licenseId, license]),
);
