import { Box, Text } from "ink";
import React from "react";
import FailureResult from "./FailureResult.js";
import SuccessResult from "./SuccessResult.js";
import UnknownResult from "./UnknownResult.js";

// Mock data for demonstration
const mockResult = {
  status: "includingUnknown" as const, // 'success' | 'failure' | 'noMatches' | 'includingUnknown'
  groupedByStatus: {
    whitelist: [
      {
        package: "package1",
        licensePath: "/path/to/package1/LICENSE",
        license: { licenseId: "MIT" },
      },
      {
        package: "package2",
        licensePath: "/path/to/package2/LICENSE",
        license: { licenseId: "Apache-2.0" },
      },
    ],
    blacklist: [
      {
        package: "package3",
        licensePath: "/path/to/package3/LICENSE",
        license: { licenseId: "GPL-3.0" },
      },
    ],
    unknown: [
      {
        package: "package4",
        licensePath: "/path/to/package4/LICENSE",
        license: { licenseId: "Unknown" },
      },
    ],
  },
};

// This whole status thingie will definitely be changed in the future
// For now, I've focused on the layout and the components
type Status = "success" | "failure" | "noMatches" | "includingUnknown";

type GroupedByStatus = {
  whitelist: Array<{
    package: string;
    licensePath: string;
    license: { licenseId: string };
  }>;
  blacklist: Array<{
    package: string;
    licensePath: string;
    license: { licenseId: string };
  }>;
  unknown: Array<{
    package: string;
    licensePath: string;
    license: { licenseId: string };
  }>;
};

export default function AuditResult() {
  const { status, groupedByStatus } = mockResult;

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text backgroundColor="blue" color="white" bold>
          {" License Audit Results "}
        </Text>
      </Box>
      {renderResult(status, groupedByStatus)}
    </Box>
  );
}

function renderResult(status: Status, groupedByStatus: GroupedByStatus) {
  switch (status) {
    case "success":
      return (
        <SuccessResult whitelistedCount={groupedByStatus.whitelist.length} />
      );
    case "failure":
      return <FailureResult groupedByStatus={groupedByStatus} />;
    case "noMatches":
    case "includingUnknown":
      return <UnknownResult groupedByStatus={groupedByStatus} />;
    default:
      return <Text>Unknown audit result status</Text>;
  }
}
