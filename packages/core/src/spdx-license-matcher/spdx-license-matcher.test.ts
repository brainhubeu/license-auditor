import { licenses } from "@license-auditor/data";
import { describe, expect, it } from "vitest";
import { matchLicense } from "./spdx-license-matcher.js";

describe.skip("spdxLicenseMatcher", () => {
  for (const license of licenses) {
    const { licenseText, standardLicenseTemplate, licenseId } = license;
    if (licenseText && standardLicenseTemplate) {
      it(`matching ${licenseId}`, () => {
        expect(matchLicense(standardLicenseTemplate, licenseText)).toBe(true);
      });
    }
  }
});
