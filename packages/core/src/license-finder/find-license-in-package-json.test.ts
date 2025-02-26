import { licenseMap } from "@license-auditor/data";
import { describe, expect, it } from "vitest";
import type { PackageJsonType } from "../file-utils.js";
import { findLicenseInPackageJson } from "./find-license-in-package-json.js";

describe("findLicenseInPackageJson", () => {
  it("should return license from the 'license' field as a single string", () => {
    const packageJson: PackageJsonType = {
      name: "test-package",
      version: "1.0.0",
      license: "MIT",
    };

    const result = findLicenseInPackageJson(
      packageJson,
      "/path/to/package.json",
    );

    const expectedLicense = licenseMap.get("MIT");

    expect(result.licenses).toEqual([
      {
        ...expectedLicense,
        source: "package.json-license",
        licensePath: "/path/to/package.json",
      },
    ]);
  });

  it("should return licenses from the 'licenses' field as an array of objects", () => {
    const packageJson: PackageJsonType = {
      name: "test-package",
      version: "1.0.0",
      licenses: [
        {
          type: "MIT",
          url: "https://opensource.org/licenses/MIT",
        },
        {
          type: "ISC",
          url: "https://opensource.org/licenses/ISC",
        },
      ],
    };

    const result = findLicenseInPackageJson(
      packageJson,
      "/path/to/package.json",
    );

    const mitLicense = licenseMap.get("MIT");
    const iscLicense = licenseMap.get("ISC");

    expect(result.licenses).toEqual([
      {
        ...mitLicense,
        source: "package.json-legacy",
        licensePath: "/path/to/package.json",
      },
      {
        ...iscLicense,
        source: "package.json-legacy",
        licensePath: "/path/to/package.json",
      },
    ]);
  });

  it("should return licenses from the 'licenses' field as an array of strings", () => {
    const packageJson: PackageJsonType = {
      name: "test-package",
      version: "1.0.0",
      licenses: ["MIT", "ISC"],
    };

    const result = findLicenseInPackageJson(
      packageJson,
      "/path/to/package.json",
    );

    const mitLicense = licenseMap.get("MIT");
    const iscLicense = licenseMap.get("ISC");

    expect(result.licenses).toEqual([
      {
        ...mitLicense,
        source: "package.json-legacy",
        licensePath: "/path/to/package.json",
      },
      {
        ...iscLicense,
        source: "package.json-legacy",
        licensePath: "/path/to/package.json",
      },
    ]);
  });

  it("should return an empty array when neither 'license' nor 'licenses' fields are present", () => {
    const packageJson: PackageJsonType = {
      name: "test-package",
      version: "1.0.0",
    };

    const result = findLicenseInPackageJson(
      packageJson,
      "/path/to/package.json",
    );
    expect(result.licenses).toEqual([]);
  });
});
