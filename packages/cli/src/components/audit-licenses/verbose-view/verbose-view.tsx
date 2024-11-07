import type { LicenseAuditResult, LicenseStatus } from "@license-auditor/data";
import { Text } from "ink";
import Table from "ink-table";
import { truncateText } from "../../../utils/truncate-text.js";

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

export default function VerboseView({
  result,
}: { result: LicenseAuditResult }) {
  const data = [
    ...result.groupedByStatus.whitelist,
    ...result.groupedByStatus.blacklist,
    ...result.groupedByStatus.unknown,
  ].map((detectedLicense) => ({
    status: detectedLicense.license.status,
    "package name": truncateText(detectedLicense.packageName),
    license: detectedLicense.license.licenseId,
    deprecated: detectedLicense.license.isDeprecatedLicenseId,
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
