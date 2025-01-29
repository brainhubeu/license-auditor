import { matchLicense as legacyMatcher } from "./legacy-matcher.js";
import { matchLicense as xmlMatcher } from "./xml-matcher.js";

export const matchLicense = (
  licenseTemplate: string,
  licenseText: string,
): boolean => {
  return (
    xmlMatcher(licenseTemplate, licenseText) ||
    legacyMatcher(licenseTemplate, licenseText)
  );
};
