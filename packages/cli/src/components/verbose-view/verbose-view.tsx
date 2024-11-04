import type { LicenseAuditResult } from "@license-auditor/data";
import { Text } from "ink";

export default function VerboseView({
  result,
}: { result: LicenseAuditResult }) {
  const data = [
    ...result.groupedByStatus.whitelist,
    ...result.groupedByStatus.blacklist,
    ...result.groupedByStatus.unknown,
  ];

  return <Text>{JSON.stringify(data)}</Text>;
}

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
