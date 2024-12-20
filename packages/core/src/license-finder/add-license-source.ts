import type {
  License,
  LicenseSource,
  LicenseWithSource,
} from "@license-auditor/data";

export const addLicenseSource = (
  licenses: License[],
  source: LicenseSource,
  licensePath: string,
): LicenseWithSource[] => {
  return licenses.map((license) => ({
    ...license,
    licensePath,
    source,
  }));
};
