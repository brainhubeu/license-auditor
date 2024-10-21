import { render } from "ink";
import React from "react";
import FailureResult from "./components/FailureResult.js";
import SuccessResult from "./components/SuccessResult.js";
import UnknownResult from "./components/UnknownResult.js";

// This is a mock render for the license auditor
// This will be removed before merging

const mockGroupedByStatus = {
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
};

function renderSuccess() {
  render(
    <SuccessResult whitelistedCount={mockGroupedByStatus.whitelist.length} />,
  );
}

function renderFailure() {
  render(<FailureResult groupedByStatus={mockGroupedByStatus} />);
}

function renderUnknown() {
  render(<UnknownResult groupedByStatus={mockGroupedByStatus} />);
}

// Uncomment the component you want to render
// renderSuccess();
renderFailure();
// renderUnknown();
