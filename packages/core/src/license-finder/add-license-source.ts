import type { License, LicenseWithSource } from '@license-auditor/data';

export const addLicenseSource = (licenses: License[], source: string): LicenseWithSource[] => {
  return licenses.map((license) => ({
    ...license,
    source,
  }));
};
