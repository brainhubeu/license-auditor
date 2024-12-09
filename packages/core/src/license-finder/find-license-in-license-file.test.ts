import { LicenseSchema, licenseMap } from "@license-auditor/data";
import { describe, expect, it } from "vitest";
import { retrieveLicenseFromLicenseFileContent } from "./find-license-in-license-file.js";

describe("retrieveLicenseFromLicenseFileContent", () => {
  it("should return an empty array when content does not match any licenses", () => {
    const content = "This is some random content without any license keywords.";
    const result = retrieveLicenseFromLicenseFileContent(content);
    expect(result.licenses).toEqual([]);
  });

  it("should return the correct license when content matches a license key", () => {
    const content = "MIT";
    const expectedLicense = LicenseSchema.parse(licenseMap.get("MIT"));
    const result = retrieveLicenseFromLicenseFileContent(content);
    expect(result.licenses).toEqual([
      { ...expectedLicense, source: "license-file-content-keywords" },
    ]);
  });

  it("should return the correct license when content matches a license name", () => {
    const content = "MIT License";
    const expectedLicense = LicenseSchema.parse(licenseMap.get("MIT"));
    const result = retrieveLicenseFromLicenseFileContent(content);
    expect(result.licenses).toEqual([
      { ...expectedLicense, source: "license-file-content-keywords" },
    ]);
  });

  it("should return multiple licenses when content matches multiple license keys or names", () => {
    const content = "MIT, Apache-2.0";
    const expectedLicenses = [
      {
        ...LicenseSchema.parse(licenseMap.get("MIT")),
        source: "license-file-content-keywords",
      },
      {
        ...LicenseSchema.parse(licenseMap.get("Apache-2.0")),
        source: "license-file-content-keywords",
      },
    ].sort((a, b) => a.name.localeCompare(b.name));
    const result = retrieveLicenseFromLicenseFileContent(content);
    const sortedLicenses = result.licenses.sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    expect(sortedLicenses).toEqual(expectedLicenses);
  });
});

// describe("retrieveLicenseFromLicenseFileName", () => {
//   it("should return an empty array when file name does not match any licenses", () => {
//     const filePath = "README.md";
//     const result = retrieveLicenseFromLicenseFileName(filePath);
//     expect(result.licenses).toEqual([]);
//   });

//   it("should return the correct license when file name matches a license key", () => {
//     const filePath = "LICENSE-MIT.txt";
//     const expectedLicense = LicenseSchema.parse(licenseMap.get("MIT"));
//     const result = retrieveLicenseFromLicenseFileName(filePath);
//     expect(result.licenses).toEqual([expectedLicense]);
//   });

//   it("should return the correct license when file name matches a license name", () => {
//     const filePath = "LICENSE-Apache-2.0";
//     const expectedLicense = LicenseSchema.parse(licenseMap.get("Apache-2.0"));
//     const result = retrieveLicenseFromLicenseFileName(filePath);
//     expect(result.licenses).toEqual([expectedLicense]);
//   });

//   it("should return an empty array when file name does not match any known license pattern", () => {
//     const filePath = "LICENSE-UNKNOWN";
//     const result = retrieveLicenseFromLicenseFileName(filePath);
//     expect(result.licenses).toEqual([]);
//   });
// });
