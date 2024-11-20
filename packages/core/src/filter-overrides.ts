import type {
  AssignedType,
  ExcludedType,
  OverridesType,
} from "@license-auditor/data";
import { extractPackageName } from "./file-utils.js";

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

  const foundPackages = packagePaths.map((packagePath) => ({
    packagePath,
    packageName: extractPackageName(packagePath),
  }));

  if (overrides.excluded) {
    excluded = overrides.excluded.filter((excludedPackage) =>
      foundPackages.some(
        (foundPackage) => foundPackage.packageName === excludedPackage,
      ),
    );
  }

  if (overrides.assignments) {
    const filteredPackages = Object.entries(overrides.assignments).filter(
      ([packageName]) =>
        foundPackages.some(
          (foundPackage) => foundPackage.packageName === packageName,
        ),
    );

    for (const [packageName, license] of filteredPackages) {
      assigned[packageName] = license;
    }
  }

  const filteredPackagePaths = foundPackages
    .filter(
      (foundPackage) =>
        !(
          excluded.some(
            (excludedPackage) => excludedPackage === foundPackage.packageName,
          ) ||
          Object.keys(assigned).some(
            (assignedPackage) => assignedPackage === foundPackage.packageName,
          )
        ),
    )
    .map((foundPackage) => foundPackage.packagePath);

  return { excluded, assigned, filteredPackagePaths };
}
