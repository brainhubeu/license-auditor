import type { ConfigType, LicenseAuditResult } from "@license-auditor/data";
import { getAllLicenses } from "./get-all-licenses.js";
import { mapLicensesToStatus } from "./map-licenses-to-statuses.js";

interface AuditLicensesProps {
  cwd: string;
  config: ConfigType;
  filterRegex?: string | undefined;
  production?: boolean | undefined;
  verbose?: boolean | undefined;
}

export async function auditLicenses({
  cwd,
  config,
  filterRegex,
  production,
  verbose,
}: AuditLicensesProps): Promise<LicenseAuditResult> {
  const { licenses, overrides, warning, errorResults } = await getAllLicenses({
    cwd,
    config,
    production,
    filterRegex,
    verbose,
  });

  const { groupedByStatus, notFound, needsUserVerification } =
    await mapLicensesToStatus(licenses, config);

  return {
    groupedByStatus: groupedByStatus,
    notFound: notFound,
    overrides: overrides,
    warning: warning,
    needsUserVerification: needsUserVerification,
    errorResults: errorResults,
  };
}
