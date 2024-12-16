import { describe, expect, it } from "vitest";
import { filterWithFilterRegex } from "./filter-with-filter-regex.js";

describe("filterWithFilterRegex", () => {
  const mockFoundPackages = [
    { packageName: "package-a", packagePath: "path/to/package-a" },
    { packageName: "package-b", packagePath: "path/to/package-b" },
    { packageName: "package-c", packagePath: "path/to/package-c" },
  ];

  it("returns all packages if filterRegex is undefined", () => {
    const result = filterWithFilterRegex({
      foundPackages: mockFoundPackages,
      filterRegex: undefined,
    });

    expect(result).toEqual(mockFoundPackages);
  });

  it("filters packages matching the regex", () => {
    const result = filterWithFilterRegex({
      foundPackages: mockFoundPackages,
      filterRegex: "package-b",
    });

    expect(result).toEqual([
      { packageName: "package-a", packagePath: "path/to/package-a" },
      { packageName: "package-c", packagePath: "path/to/package-c" },
    ]);
  });

  it("returns all packages when no matches are found", () => {
    const result = filterWithFilterRegex({
      foundPackages: mockFoundPackages,
      filterRegex: "non-existent-package",
    });

    expect(result).toEqual(mockFoundPackages);
  });

  it("handles special characters in filterRegex", () => {
    const result = filterWithFilterRegex({
      foundPackages: mockFoundPackages,
      filterRegex: "package-a|package-c",
    });

    expect(result).toEqual([
      { packageName: "package-b", packagePath: "path/to/package-b" },
    ]);
  });

  it("throws an error if invalid regex is provided", () => {
    expect(() =>
      filterWithFilterRegex({
        foundPackages: mockFoundPackages,
        filterRegex: "[invalid-regex",
      }),
    ).toThrow(SyntaxError);
  });
});
