import type { LicenseAuditResult, LicenseStatus } from "@license-auditor/data";
import { Text } from "ink";
import { Table, type Column } from "../table.js";
import { useMemo } from "react";

function getColorForStatus(status: LicenseStatus) {
  switch (status) {
    case "whitelist":
      return "green";
    case "blacklist":
      return "red";
    default:
      return "yellow";
  }
}

interface VerboseViewProps {
  result: LicenseAuditResult;
  filter: LicenseStatus | undefined;
}

interface VerboseViewData extends Record<string, string> {
  status: LicenseStatus;
  packageName: string;
  license: string;
  deprecated: string;
}

const columns: Column<VerboseViewData>[] = [
  {
    title: "status",
    accessor: "status",
    cell: (rowData: VerboseViewData) => (
      <Text color={getColorForStatus(rowData.status)}>{rowData.status}</Text>
    ),
  },
  {
    title: "package name",
    accessor: "packageName",
  },
  {
    title: "license",
    accessor: "license",
  },
  {
    title: "deprecated",
    accessor: "deprecated",
  },
] as const;

export default function VerboseView({ result, filter }: VerboseViewProps) {
  const data = useMemo(() => {
    let combinedResult = [
      ...result.groupedByStatus.whitelist,
      ...result.groupedByStatus.blacklist,
      ...result.groupedByStatus.unknown,
    ];

    if (filter) {
      combinedResult = combinedResult.filter(
        (license) => license.status === filter,
      );
    }

    return combinedResult.map((detectedLicense) => ({
      status: detectedLicense.status,
      packageName: detectedLicense.packageName,
      license: detectedLicense.licenseExpression
        ? detectedLicense.licenseExpression
        : detectedLicense.licenses
            .map((license) => license.licenseId)
            .join(", "),
      deprecated: detectedLicense.licenses.some(
        (license) => license.isDeprecatedLicenseId,
      )
        ? "Yes"
        : "No",
    }));
  }, [result, filter]);

  return <Table<VerboseViewData> columns={columns} data={data} />;
}
