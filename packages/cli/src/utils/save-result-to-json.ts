import fs from "node:fs/promises";
import type { LicenseAuditResult } from "@license-auditor/data";

export async function saveResultToJson(
  result: LicenseAuditResult,
  jsonPath: string,
) {
  const parsedResult = {
    ...result.groupedByStatus,
    notFound: Array.from(result.notFound.entries()).map(
      ([packageName, value]) => ({
        packageName,
        ...value,
      }),
    ),
  };
  await fs.writeFile(jsonPath, JSON.stringify(parsedResult, null, 2));
}
