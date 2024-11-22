import type { DetectedLicense, OverridesType } from "@license-auditor/data";

// splits out version, takes scoped packages into account
function getPackageName(packageName: string): string {
  const atIndex = packageName.lastIndexOf("@");

  if (atIndex > 0) {
    return packageName.slice(0, atIndex);
  }

  return packageName;
}

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

  const filteredPackages = foundPackages.filter(
    (foundPackage) =>
      !Object.keys(overrides).some(
        (excludedPackage) =>
          excludedPackage === getPackageName(foundPackage.packageName),
      ),
  );

  const notFoundOverrides = Object.keys(overrides).filter(
    (packageName) =>
      !foundPackages.some(
        (foundPackage) =>
          getPackageName(foundPackage.packageName) === packageName,
      ),
  );

  return {
    filteredPackages,
    notFoundOverrides,
  };
}
