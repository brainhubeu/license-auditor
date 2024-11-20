import type {
  AssignedType,
  ExcludedType,
  OverridesType,
} from "@license-auditor/data";

export function filterOverrides({
  foundPackages,
  overrides,
}: {
  foundPackages: {
    packageName: string;
    packagePath: string;
  }[];
  overrides: OverridesType | undefined;
}): {
  excluded: ExcludedType;
  assigned: AssignedType;
  extraOverrides: string[];
  filteredPackages: {
    packageName: string;
    packagePath: string;
  }[];
} {
  if (!overrides) {
    return {
      excluded: [],
      assigned: {},
      filteredPackages: foundPackages,
      extraOverrides: [],
    };
  }

  const { assignments, excluded } = overrides;

  const filteredPackages = foundPackages.filter(
    (foundPackage) =>
      !(
        excluded?.some(
          (excludedPackage) => excludedPackage === foundPackage.packageName,
        ) ||
        (assignments &&
          Object.keys(assignments).some(
            (assignedPackage) => assignedPackage === foundPackage.packageName,
          ))
      ),
  );

  const extraAssigned =
    assignments &&
    Object.keys(assignments).filter(
      ([packageName]) =>
        !foundPackages.some(
          (foundPackage) => foundPackage.packageName === packageName,
        ),
    );

  const extraExcluded = excluded?.filter(
    (excludedPackage) =>
      !foundPackages.some(
        (foundPackage) => foundPackage.packageName === excludedPackage,
      ),
  );

  return {
    excluded: excluded ?? [],
    assigned: assignments ?? {},
    filteredPackages,
    extraOverrides: [...(extraAssigned ?? []), ...(extraExcluded ?? [])],
  };
}
