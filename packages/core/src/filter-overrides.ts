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
  validOverrides: {
    warnOverrides: string[];
    offOverrides: string[];
  };
  notFoundOverrides: string[];
  filteredPackages: {
    packageName: string;
    packagePath: string;
  }[];
} {
  if (!overrides) {
    return {
      validOverrides: {
        warnOverrides: [],
        offOverrides: [],
      },
      filteredPackages: foundPackages,
      notFoundOverrides: [],
    };
  }

  const { off, warn } = overrides;

  const filteredPackages = foundPackages.filter(
    (foundPackage) =>
      !(
        off?.some(
          (excludedPackage) =>
            excludedPackage === getPackageName(foundPackage.packageName),
        ) ||
        warn?.some(
          (warnPackage) =>
            warnPackage === getPackageName(foundPackage.packageName),
        )
      ),
  );

  const notFoundWarn = warn?.filter(
    (packageName) =>
      !foundPackages.some(
        (foundPackage) =>
          getPackageName(foundPackage.packageName) === packageName,
      ),
  );

  const notFoundOff = off?.filter(
    (packageName) =>
      !foundPackages.some(
        (foundPackage) =>
          getPackageName(foundPackage.packageName) === packageName,
      ),
  );

  return {
    validOverrides: {
      warnOverrides: overrides.warn ?? [],
      offOverrides: overrides.off ?? [],
    },
    filteredPackages,
    notFoundOverrides: [...(notFoundWarn ?? []), ...(notFoundOff ?? [])],
  };
}
