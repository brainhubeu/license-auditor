import type { ConfigType, LicenseAuditResult } from "@license-auditor/data";
import { getAllLicenses } from "./get-all-licenses.js";
import { mapLicensesToStatus } from "./map-licenses-to-statuses.js";

export async function auditLicenses(
  cwd: string,
  config: ConfigType,
  production?: boolean | undefined,
  filterRegex?: string,
): Promise<LicenseAuditResult> {
  const { licenses, overrides, warning, errorResults } = await getAllLicenses(cwd, config, production, filterRegex);

  const { groupedByStatus, notFound, needsUserVerification } = await mapLicensesToStatus(licenses, config);

  return {
    groupedByStatus: groupedByStatus,
    notFound: notFound,
    overrides: overrides,
    warning: warning,
    needsUserVerification: needsUserVerification,
    errorResults: errorResults,
  };
}
