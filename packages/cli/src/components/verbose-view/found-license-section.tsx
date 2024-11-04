import type { DetectedLicense, LicenseStatus } from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";

function getStatusIcon(status: LicenseStatus) {
  switch (status) {
    case "whitelist":
      return { icon: figures.tick, color: "green" };
    case "blacklist":
      return { icon: figures.cross, color: "red" };
    case "unknown":
      return { icon: figures.warning, color: "yellow" };
    default:
      return { icon: figures.bullet, color: "white" };
  }
}

function FoundLicenseDetails({ license }: { license: DetectedLicense }) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      <Text>
        Package: <Text color="cyan">{license.packageName}</Text>
      </Text>
      <Text>
        License ID:{" "}
        <Text color="cyan" bold>
          {license.license.licenseId}
        </Text>
      </Text>
      <Text>
        License Path: <Text color="blue">{license.licensePath}</Text>
      </Text>
      <Text>
        License is deprecated:{" "}
        <Text
          color={license.license.isDeprecatedLicenseId ? "red" : "green"}
          dimColor={!license.license.isDeprecatedLicenseId}
          bold={license.license.isDeprecatedLicenseId}
        >
          {license.license.isDeprecatedLicenseId ? "Yes" : "No"}
        </Text>
      </Text>
    </Box>
  );
}

export function FoundLicenseSection({
  title,
  licenses,
}: { title: string; licenses: DetectedLicense[] }) {
  return (
    <Box flexDirection="column">
      <Text bold>{title}</Text>
      {licenses.map((l) => {
        const { icon, color } = getStatusIcon(l.license.status);
        return (
          <Box key={l.packageName} flexDirection="row" marginBottom={1}>
            <Text color={color}>{icon}</Text>
            <FoundLicenseDetails license={l} />
          </Box>
        );
      })}
    </Box>
  );
}
