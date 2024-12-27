import type { ConfigType, LicenseWithSource } from "@license-auditor/data";
import { describe, expect, it } from "vitest";
import type { LicensesWithPath } from "./license-finder/licenses-with-path.js";
import { resolveLicenseStatus } from "./resolve-license-status.js";

describe("resolveLicenseStatus", () => {
  const baseLicense: Pick<
    LicenseWithSource,
    | "isDeprecatedLicenseId"
    | "isOsiApproved"
    | "seeAlso"
    | "detailsUrl"
    | "reference"
    | "source"
    | "name"
  > = {
    isDeprecatedLicenseId: false,
    isOsiApproved: true,
    seeAlso: [],
    detailsUrl: "",
    reference: "",
    name: "",
    source: "package.json-license",
  };

  const mockConfig: ConfigType = {
    whitelist: ["MIT", "Apache-2.0"],
    blacklist: ["GPL-3.0"],
  };

  it("should return status based on licenseExpression when present", () => {
    const licensesWithPath: LicensesWithPath = {
      licenses: [],
      licenseExpression: "MIT OR GPL-3.0",
      licensePath: ["/path/to/package"],
      licenseExpressionParsed: {
        conjunction: "or",
        left: { license: "MIT" },
        right: { license: "GPL-3.0" },
      },
    };

    const result = resolveLicenseStatus(licensesWithPath, mockConfig);

    expect(result).toBe("whitelist");
  });

  it("should return 'blacklist' if any license is blacklisted", () => {
    const licensesWithPath: LicensesWithPath = {
      licenses: [
        {
          ...baseLicense,
          licenseId: "MIT",
        },
        {
          ...baseLicense,
          licenseId: "GPL-3.0",
        },
      ],
      licensePath: ["/path/to/package"],
      licenseExpression: undefined,
      licenseExpressionParsed: undefined,
    };

    const result = resolveLicenseStatus(licensesWithPath, mockConfig);

    expect(result).toBe("blacklist");
  });

  it("should return 'unknown' if a license is not in the whitelist or blacklist", () => {
    const licensesWithPath: LicensesWithPath = {
      licenses: [
        {
          ...baseLicense,
          licenseId: "AAL",
        },
      ],
      licensePath: ["/path/to/package"],
      licenseExpression: undefined,
      licenseExpressionParsed: undefined,
    };

    const result = resolveLicenseStatus(licensesWithPath, mockConfig);

    expect(result).toBe("unknown");
  });

  it("should return 'whitelist' if all licenses are whitelisted", () => {
    const licensesWithPath: LicensesWithPath = {
      licenses: [
        {
          ...baseLicense,
          licenseId: "MIT",
        },
        {
          ...baseLicense,
          licenseId: "Apache-2.0",
        },
      ],
      licensePath: ["/path/to/package"],
      licenseExpression: undefined,
      licenseExpressionParsed: undefined,
    };

    const result = resolveLicenseStatus(licensesWithPath, mockConfig);

    expect(result).toBe("whitelist");
  });

  it("should prioritize 'blacklist' over 'unknown' when both are present", () => {
    const licensesWithPath: LicensesWithPath = {
      licenses: [
        {
          ...baseLicense,
          licenseId: "GPL-3.0",
        },
        {
          ...baseLicense,
          licenseId: "AAL",
        },
      ],
      licensePath: ["/path/to/package"],
      licenseExpression: undefined,
      licenseExpressionParsed: undefined,
    };

    const result = resolveLicenseStatus(licensesWithPath, mockConfig);

    expect(result).toBe("blacklist");
  });

  it("should prioritize 'blacklist' over 'whitelist' when both are present", () => {
    const licensesWithPath: LicensesWithPath = {
      licenses: [
        {
          ...baseLicense,
          licenseId: "MIT",
        },
        {
          ...baseLicense,
          licenseId: "GPL-3.0",
        },
      ],
      licensePath: ["/path/to/package"],
      licenseExpression: undefined,
      licenseExpressionParsed: undefined,
    };

    const result = resolveLicenseStatus(licensesWithPath, mockConfig);

    expect(result).toBe("blacklist");
  });
});
