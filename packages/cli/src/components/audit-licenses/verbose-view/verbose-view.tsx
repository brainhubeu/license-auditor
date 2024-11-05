import type { LicenseAuditResult, LicenseStatus } from "@license-auditor/data";
import { Text } from "ink";
import Table from "ink-table";

enum VerboseViewColumn {
  Status = 0,
  PackageName = 1,
  PackagePath = 2,
  LicenseId = 3,
  LicensePath = 4,
  IsDeprecatedLicenseId = 5,
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
    "package name": detectedLicense.packageName,
    // packagePath: detectedLicense.packagePath,
    license: detectedLicense.license.licenseId,
    // licensePath: detectedLicense.licensePath,
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
          // case VerboseViewColumn.LicensePath:
          // case VerboseViewColumn.PackagePath:
          //   return (
          //     <Box width={50}>
          //       <Text wrap="truncate-start">{children}</Text>
          //     </Box>
          //   );
          default:
            return <Text>{children}</Text>;
        }
      }}
    />
  );
}
