import { licenseMap } from "@license-auditor/data";
import type { Info } from "spdx-expression-parse";
import { describe, expect, it, vi } from "vitest";
import { extractLicensesFromExpression } from "./extract-licenses-from-expression.js";
import { parseLicenseLogicalExpression } from "./parse-license-logical-expression.js";

describe("extractLicensesFromExpression", () => {
  it("should extract multiple licenses from an alternative expression", () => {
    const license = "MIT OR Apache-2.0";

    const parsedLicense = parseLicenseLogicalExpression(license);

    if (!parsedLicense) {
      throw new Error("Failed to parse license");
    }

    const mitLicense = licenseMap.get("MIT");
    const apacheLicense = licenseMap.get("Apache-2.0");

    const result = extractLicensesFromExpression(parsedLicense);

    expect(result).toEqual([mitLicense, apacheLicense]);
  });

  it("should extract a single license from a simple expression", () => {
    const license = "MIT";

    const parsedLicense = parseLicenseLogicalExpression(license);

    if (!parsedLicense) {
      throw new Error("Failed to parse license");
    }

    const mitLicense = licenseMap.get("MIT");

    const result = extractLicensesFromExpression(parsedLicense);

    expect(result).toEqual([mitLicense]);
  });

  it("should extract multiple licenses from a conjunction expression", () => {
    const license = "MIT AND ISC";

    const parsedLicense = parseLicenseLogicalExpression(license);

    if (!parsedLicense) {
      throw new Error("Failed to parse license");
    }

    const mitLicense = licenseMap.get("MIT");
    const iscLicense = licenseMap.get("ISC");

    const result = extractLicensesFromExpression(parsedLicense);

    expect(result).toEqual([mitLicense, iscLicense]);
  });

  it("should handle nested conjunction and alternative expressions", () => {
    const license = "(MIT AND ISC) OR Apache-2.0";

    const parsedLicense = parseLicenseLogicalExpression(license);

    if (!parsedLicense) {
      throw new Error("Failed to parse license");
    }

    const mitLicense = licenseMap.get("MIT");
    const iscLicense = licenseMap.get("ISC");
    const apacheLicense = licenseMap.get("Apache-2.0");

    const result = extractLicensesFromExpression(parsedLicense);

    expect(result).toEqual([mitLicense, iscLicense, apacheLicense]);
  });

  it("should log an error if a license is not found", () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const parsedLicense = {
      left: { license: "Wrong" },
      conjunction: "or",
      right: { license: "Wrong-2.0" },
    } as Info;

    extractLicensesFromExpression(parsedLicense);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to find license:",
      "Wrong",
      "in expression:",
      parsedLicense,
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to find license:",
      "Wrong-2.0",
      "in expression:",
      parsedLicense,
    );

    consoleErrorSpy.mockRestore();
  });
});
