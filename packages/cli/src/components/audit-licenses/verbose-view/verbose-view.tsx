import type { LicenseAuditResult, LicenseStatus } from "@license-auditor/data";
import { Box, Static, Text } from "ink";
import { truncateText } from "../../../utils/truncate-text.js";

// enum VerboseViewColumn {
//   Status = 0,
//   PackageName = 1,
//   License = 2,
//   Deprecated = 3,
//   LicensePath = 4,
// }

// function getColorForStatus(status: LicenseStatus) {
//   switch (status) {
//     case "whitelist":
//       return "green";
//     case "blacklist":
//       return "red";
//     default:
//       return "yellow";
//   }
// }

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
      (license) => license.license.status === filter,
    );
  }

  const data = combinedResult.map((detectedLicense) => ({
    status: detectedLicense.license.status,
    "package name": truncateText(detectedLicense.packageName),
    license: detectedLicense.license.licenseId,
    deprecated: detectedLicense.license.isDeprecatedLicenseId,
  }));

  if (!data.length) {
    return (
      <Text color="yellow">
        No licenses found {filter ? `with status ${filter}` : ""}
      </Text>
    );
  }

  return (
    <Static items={data}>
      {(item) => (
        <Box key={item["package name"]}>
          <Text>{item["package name"]}</Text>
          <Text>{item.license}</Text>
          <Text>{item.status}</Text>
        </Box>
      )}
    </Static>
    // <Table
    //   data={data}
    //   cell={({ column, children, value }) => {
    //     switch (column) {
    //       case VerboseViewColumn.Status:
    //         return (
    //           <Text color={getColorForStatus(value as LicenseStatus)}>
    //             {children}
    //           </Text>
    //         );
    //       default:
    //         return <Text>{children}</Text>;
    //     }
    //   }}
    // />
  );
}
