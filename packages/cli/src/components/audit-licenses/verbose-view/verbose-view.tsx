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

  // todo: table
  // react-ink uses ink 3.2.0 which is incompatible with ink 5
  // we need to attempt to fork it and make it compatible
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
