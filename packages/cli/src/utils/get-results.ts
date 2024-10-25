import type { LicenseAuditResult } from "@brainhubeu/license-auditor-core";

type GroupedByStatus = Pick<LicenseAuditResult, "groupedByStatus">;

export type HasResultsParams = {
  result: GroupedByStatus;
  status: "whitelist" | "blacklist" | "unknown";
};

export function hasResults({ result, status }: HasResultsParams) {
  return getResults({ result, status }).length > 0;
}

export type GetResultsParams = {
  result: GroupedByStatus;
  status: "whitelist" | "blacklist" | "unknown";
};

export function getResults({ result, status }: GetResultsParams) {
  return result.groupedByStatus?.[status] ?? [];
}
