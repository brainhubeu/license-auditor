import type { DetectedLicense, OverridesType } from "@license-auditor/data";
import { getPackageName } from "./get-package-name.js";

export function filterOverrides({
  foundPackages,
  overrides,
}: {
  foundPackages: Pick<DetectedLicense, "packageName" | "packagePath">[];
  overrides: OverridesType | undefined;
}): {
  notFoundOverrides: string[];
  filteredPackages: {
    packageName: string;
    packagePath: string;
  }[];
} {
  if (!overrides || Object.keys(overrides).length === 0) {
    return {
      filteredPackages: foundPackages,
      notFoundOverrides: [],
    };
  }

  const excludedPackageNames = new Set(Object.keys(overrides));
  const foundPackageNames = new Set(
    foundPackages.map((foundPackage) =>
      getPackageName(foundPackage.packageName),
    ),
  );
  const filteredPackages = foundPackages.filter(
    (foundPackage) =>
      !excludedPackageNames.has(getPackageName(foundPackage.packageName)),
  );
  const notFoundOverrides = Array.from(excludedPackageNames).filter(
    (packageName) => !foundPackageNames.has(packageName),
  );

  return {
    filteredPackages,
    notFoundOverrides,
  };
}
