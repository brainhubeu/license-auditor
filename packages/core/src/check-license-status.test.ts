import { describe, expect, it } from "vitest";
import { checkLicenseStatus } from "./check-license-status.js";
import type { ConfigType, License } from "@license-auditor/data";

describe("checkLicenseStatus", () => {
  const mockConfig: ConfigType = {
    whitelist: ["MIT", "Apache-2.0"],
    blacklist: ["GPL-3.0", "AGPL-3.0"],
  };
  const baseLicense: Pick<
    License,
    "isOsiApproved" | "isDeprecatedLicenseId" | "detailsUrl" | "reference" | "referenceNumber" | "seeAlso"
  > = {
    isOsiApproved: false,
    isDeprecatedLicenseId: false,
    detailsUrl: "",
    reference: "",
    referenceNumber: 0,
    seeAlso: [],
  };

  it("should return 'whitelist' if the license is in the whitelist", () => {
    const license: License = { ...baseLicense, licenseId: "MIT", name: "MIT License" };
    const result = checkLicenseStatus(license, mockConfig);
    expect(result).toBe("whitelist");
  });

  it("should return 'blacklist' if the license is in the blacklist", () => {
    const license: License = {
      ...baseLicense,
      licenseId: "GPL-3.0",
      name: "GPL 3.0 License",
    };
    const result = checkLicenseStatus(license, mockConfig);
    expect(result).toBe("blacklist");
  });

  it("should return 'unknown' if the license is not in the whitelist or blacklist", () => {
    const license: License = {
      ...baseLicense,
      licenseId: "BSD-3-Clause",
      name: "BSD 3-Clause License",
    };
    const result = checkLicenseStatus(license, mockConfig);
    expect(result).toBe("unknown");
  });

  it("should handle an empty whitelist and blacklist correctly", () => {
    const emptyConfig = { whitelist: [], blacklist: [] };
    const license: License = {
      ...baseLicense,
      licenseId: "MIT",
      name: "MIT License",
    };
    const result = checkLicenseStatus(license, emptyConfig);
    expect(result).toBe("unknown");
  });
});
