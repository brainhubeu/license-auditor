import type { OverridesType } from "@license-auditor/data";
import { extractPackageName } from "./file-utils.js";

type ExcludedType = NonNullable<Pick<OverridesType, "excluded">["excluded"]>;
type AssignedType = NonNullable<
  Pick<OverridesType, "assignments">["assignments"]
>;

export function filterOverrides({
  packagePaths,
  overrides,
}: {
  packagePaths: string[];
  overrides?: OverridesType | undefined;
}): {
  excluded: ExcludedType;
  assigned: AssignedType;
  filteredPackagePaths: string[];
} {
  let excluded: ExcludedType = [];
  const assigned: AssignedType = {};

  if (!overrides) {
    return { excluded, assigned, filteredPackagePaths: packagePaths };
  }

  const packages = packagePaths.map((packagePath) => ({
    packagePath,
    packageName: extractPackageName(packagePath),
  }));

  if (overrides.excluded) {
    excluded = overrides.excluded.filter((excludedPackage) =>
      packages.some((pckg) => pckg.packageName === excludedPackage),
    );
  }

  if (overrides.assignments) {
    const filteredPackages = Object.entries(overrides.assignments).filter(
      ([packageName]) =>
        packages.some((pckg) => pckg.packageName === packageName),
    );

    for (const [packageName, license] of filteredPackages) {
      assigned[packageName] = license;
    }
  }

  const filteredPackagePaths = packages
    .filter(
      (pckg) =>
        !(
          excluded.some(
            (excludedPackage) => excludedPackage === pckg.packageName,
          ) ||
          Object.keys(assigned).some(
            (assignedPackage) => assignedPackage === pckg.packageName,
          )
        ),
    )
    .map((pckg) => pckg.packagePath);

  return { excluded, assigned, filteredPackagePaths };
}
