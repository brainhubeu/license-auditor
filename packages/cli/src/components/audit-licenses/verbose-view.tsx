// @ts-nocheck
import type { LicenseAuditResult, LicenseStatus } from "@license-auditor/data";
import { Text } from "ink";
import Table from "ink-table";
import { truncateText } from "../../utils/truncate-text.js";

enum VerboseViewColumn {
  Status = 0,
  PackageName = 1,
  License = 2,
  Deprecated = 3,
  LicensePath = 4,
}

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

export default function VerboseView({ result, filter }: VerboseViewProps) {
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

  const data = combinedResult.map((detectedLicense) => ({
    status: detectedLicense.status,
    "package name": detectedLicense.packageName,
    license: detectedLicense.licenseExpression
      ? detectedLicense.licenseExpression
      : detectedLicense.licenses.map((license) => license.licenseId).join(", "),
    deprecated: detectedLicense.licenses.some(
      (license) => license.isDeprecatedLicenseId,
    ),
  }));

  return (
    <Table
      data={data}
      cell={({ column, children, value }) => {
        switch (column) {
          case VerboseViewColumn.Status:
            return (
              <Text color={getColorForStatus(value as LicenseStatus)}>
                {children}
              </Text>
            );
          default:
            return <Text>{children}</Text>;
        }
      }}
    />
  );
}
