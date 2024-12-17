import { describe, expect, it } from "vitest";
import { filterOverrides } from "./filter-overrides.js";

// is filterOverrides working as expected? seems like record value does not matter
describe("filterOverrides", () => {
  it("should return all foundPackages if overrides is undefined", () => {
    const foundPackages = [
      { packageName: "package1", packagePath: "/path/to/package1" },
      { packageName: "package2", packagePath: "/path/to/package2" },
    ];
    const overrides = undefined;

    const result = filterOverrides({ foundPackages, overrides });

    expect(result).toEqual({
      filteredPackages: foundPackages,
      notFoundOverrides: [],
    });
  });

  it("should return all foundPackages if overrides is an empty object", () => {
    const foundPackages = [
      { packageName: "package1", packagePath: "/path/to/package1" },
      { packageName: "package2", packagePath: "/path/to/package2" },
    ];
    const overrides = {};

    const result = filterOverrides({ foundPackages, overrides });

    expect(result).toEqual({
      filteredPackages: foundPackages,
      notFoundOverrides: [],
    });
  });

  it("should filter out packages specified in overrides", () => {
    const foundPackages = [
      { packageName: "package1", packagePath: "/path/to/package1" },
      { packageName: "package2@1.0.0", packagePath: "/path/to/package2" },
      { packageName: "package3", packagePath: "/path/to/package3" },
    ];
    const overrides: Record<string, "warn" | "off"> = {
      package2: "off",
      package4: "warn",
    };

    const result = filterOverrides({ foundPackages, overrides });

    expect(result).toEqual({
      filteredPackages: [
        { packageName: "package1", packagePath: "/path/to/package1" },
        { packageName: "package3", packagePath: "/path/to/package3" },
      ],
      notFoundOverrides: ["package4"],
    });
  });

  it("should correctly handle scoped packages and versioned names", () => {
    const foundPackages = [
      {
        packageName: "@scope/package1@2.3.4",
        packagePath: "/path/to/package1",
      },
      {
        packageName: "@scope/package2@1.0.0",
        packagePath: "/path/to/package2",
      },
    ];
    const overrides: Record<string, "warn" | "off"> = {
      "@scope/package2": "off",
      "@scope/package3": "warn",
    };

    const result = filterOverrides({ foundPackages, overrides });

    expect(result).toEqual({
      filteredPackages: [
        {
          packageName: "@scope/package1@2.3.4",
          packagePath: "/path/to/package1",
        },
      ],
      notFoundOverrides: ["@scope/package3"],
    });
  });

  it("should correctly handle packages without versions", () => {
    const foundPackages = [
      { packageName: "package1", packagePath: "/path/to/package1" },
      { packageName: "package2", packagePath: "/path/to/package2" },
    ];
    const overrides: Record<string, "warn" | "off"> = {
      package2: "off",
      package3: "warn",
    };

    const result = filterOverrides({ foundPackages, overrides });

    expect(result).toEqual({
      filteredPackages: [
        { packageName: "package1", packagePath: "/path/to/package1" },
      ],
      notFoundOverrides: ["package3"],
    });
  });
});
