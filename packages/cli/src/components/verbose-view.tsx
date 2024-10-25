import type {
  DetectedLicense,
  LicenseAuditResult,
  LicenseStatus,
} from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";
import React from "react";

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

function LicenseDetails({ license }: { license: DetectedLicense }) {
  return (
    <Box flexDirection="column" marginLeft={2}>
      <Text>
        Package: <Text color="cyan">{license.package}</Text>
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
      {license.license.detailsUrl && (
        <Text>
          Details: <Text color="cyan">{license.license.detailsUrl}</Text>
        </Text>
      )}
    </Box>
  );
}

function LicenseSection({
  title,
  licenses,
}: { title: string; licenses: DetectedLicense[] }) {
  return (
    <Box flexDirection="column">
      <Text bold>{title}</Text>
      {licenses.map((l) => {
        const { icon, color } = getStatusIcon(l.license.status);
        return (
          <Box key={l.package} flexDirection="row" marginBottom={1}>
            <Text color={color}>{icon}</Text>
            <LicenseDetails license={l} />
          </Box>
        );
      })}
    </Box>
  );
}

export default function VerboseView({
  result,
}: { result: LicenseAuditResult }) {
  const hasWhitelisted = result.groupedByStatus.whitelist.length > 0;
  const hasBlacklisted = result.groupedByStatus.blacklist.length > 0;
  const hasUnknown = result.groupedByStatus.unknown.length > 0;

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text backgroundColor="cyan" color="black" bold>
          {" Verbose License Audit Results "}
        </Text>
      </Box>
      {hasWhitelisted && (
        <LicenseSection
          title="Whitelisted Licenses"
          licenses={result.groupedByStatus.whitelist}
        />
      )}
      {hasBlacklisted && (
        <LicenseSection
          title="Blacklisted Licenses"
          licenses={result.groupedByStatus.blacklist}
        />
      )}
      {hasUnknown && (
        <LicenseSection
          title="Unknown Licenses"
          licenses={result.groupedByStatus.unknown}
        />
      )}
    </Box>
  );
}
