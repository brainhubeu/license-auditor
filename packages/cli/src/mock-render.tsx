// @ts-nocheck -- this is a mock render and the functions will come off as unused
import type { LicenseAuditResult } from "@license-auditor/data";
import { render } from "ink";
import AuditResult from "./components/audit-result.js";

// This is a mock render for the license auditor
// This whole file will be removed before merging

const mockResult: LicenseAuditResult = {
  notFound: new Map(),
  groupedByStatus: {
    whitelist: [
      {
        package: "package1",
        path: "path/to/package",
        licensePath: "/path/to/package1/LICENSE",
        license: {
          reference: "",
          isDeprecatedLicenseId: false,
          detailsUrl: "",
          referenceNumber: 0,
          name: "",
          licenseId: "MIT",
          seeAlso: [],
          isOsiApproved: false,
          status: "whitelist",
        },
      },
      {
        package: "package2",
        path: "path/to/package",
        licensePath: "/path/to/package2/LICENSE",
        license: {
          reference: "",
          isDeprecatedLicenseId: false,
          detailsUrl: "",
          referenceNumber: 0,
          name: "",
          licenseId: "Apache-2.0",
          seeAlso: [],
          isOsiApproved: false,
          status: "whitelist",
        },
      },
    ],
    blacklist: [
      {
        package: "package3",
        path: "path/to/package",
        // licensePath: "/path/to/package3/LICENSE",
        licensePath:
          "/Users/mateuszjarzebowskibownik/Brainhub/someLicenseFile.txt",
        license: {
          reference: "",
          isDeprecatedLicenseId: false,
          detailsUrl: "",
          referenceNumber: 0,
          name: "",
          licenseId: "GPL-3.0",
          seeAlso: [],
          isOsiApproved: false,
          status: "blacklist",
        },
      },
    ],
    unknown: [
      {
        package: "package5",
        path: "path/to/package",
        // licensePath: "/path/to/package3/LICENSE",
        licensePath:
          "/Users/mateuszjarzebowskibownik/Brainhub/someLicenseFile.txt",
        license: {
          reference: "",
          isDeprecatedLicenseId: false,
          detailsUrl: "",
          referenceNumber: 0,
          name: "",
          licenseId: "0BSD",
          seeAlso: [],
          isOsiApproved: false,
          status: "unknown",
        },
      },
      {
        package: "package6",
        path: "path/to/package",
        licensePath: "/path/to/package6/LICENSE",
        license: {
          reference: "",
          isDeprecatedLicenseId: true,
          detailsUrl: "",
          referenceNumber: 0,
          name: "",
          licenseId: "0BSD",
          seeAlso: [],
          isOsiApproved: false,
          status: "unknown",
        },
      },
      {
        package: "package7",
        path: "path/to/package",
        licensePath: "/path/to/package7/LICENSE",
        license: {
          reference: "",
          isDeprecatedLicenseId: true,
          detailsUrl: "",
          referenceNumber: 0,
          name: "",
          licenseId: "0BSD",
          seeAlso: [],
          isOsiApproved: false,
          status: "unknown",
        },
      },
    ],
  },
};

const populatedNotFound = new Map([
  [
    "axios",
    {
      packagePath: "path/to/axios",
      errorMessage: "Incorrect package.json format",
    },
  ],
  [
    "@somecompany/somepackage",
    {
      packagePath: "path/to/somepackage",
      errorMessage: "Error message",
    },
  ],
  ["lodash", { packagePath: "path/to/lodash", errorMessage: "Error message" }],
]);

const emptyMock: LicenseAuditResult = {
  notFound: populatedNotFound,
  groupedByStatus: { whitelist: [], blacklist: [], unknown: [] },
};

function renderSuccess() {
  render(
    <AuditResult
      verbose={true}
      result={{
        groupedByStatus: {
          ...mockResult.groupedByStatus,
          blacklist: [],
          unknown: [],
        },
        notFound: mockResult.notFound,
      }}
    />,
  );
}

function renderFailure() {
  render(
    <AuditResult
      verbose={true}
      result={{
        groupedByStatus: {
          ...mockResult.groupedByStatus,
          unknown: [],
        },
        notFound: populatedNotFound,
      }}
    />,
  );
}

function renderFailedAndUnknown() {
  render(
    <AuditResult
      verbose={true}
      result={{
        groupedByStatus: {
          ...mockResult.groupedByStatus,
          whitelist: [],
        },
        notFound: mockResult.notFound,
      }}
    />,
  );
}

function renderAll() {
  render(<AuditResult result={mockResult} verbose={true} />);
}

function renderKnownAndUnknown() {
  render(
    <AuditResult
      verbose={true}
      result={{
        groupedByStatus: {
          ...mockResult.groupedByStatus,
          blacklist: [],
        },
        notFound: mockResult.notFound,
      }}
    />,
  );
}

function renderFailedOnly() {
  render(
    <AuditResult
      verbose={true}
      result={{
        groupedByStatus: {
          ...mockResult.groupedByStatus,
          whitelist: [],
          unknown: [],
        },
        notFound: mockResult.notFound,
      }}
    />,
  );
}

function renderUnknownOnly() {
  render(
    <AuditResult
      verbose={true}
      result={{
        groupedByStatus: {
          ...mockResult.groupedByStatus,
          whitelist: [],
          blacklist: [],
        },
        notFound: mockResult.notFound,
      }}
    />,
  );
}

function renderEmpty() {
  render(<AuditResult result={emptyMock} verbose={true} />);
}

function renderAllWithNotFound() {
  const mockResultWithNotFound: LicenseAuditResult = {
    ...mockResult,
    notFound: populatedNotFound,
  };

  render(<AuditResult result={mockResultWithNotFound} verbose={true} />);
}

function renderVerbose() {
  render(<AuditResult result={mockResult} verbose={true} />);
}

// Uncomment the component you want to render
// renderSuccess();
// renderFailure();
// renderFailedOnly();
// renderUnknownOnly();
// renderFailedAndUnknown();
// renderKnownAndUnknown();
// renderAll();
// renderEmpty();
// renderAllWithNotFound();
renderVerbose();
