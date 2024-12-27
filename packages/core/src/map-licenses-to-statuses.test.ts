import type {
  ConfigType,
  LicenseId,
  LicenseSource,
  LicenseWithSource,
  VerificationStatus,
} from "@license-auditor/data";
import { describe, expect, it } from "vitest";
import type { PackageLicensesWithPath } from "./get-all-licenses.js";
import type { LicensesWithPathAndStatus } from "./license-finder/licenses-with-path.js";
import { mapLicensesToStatus } from "./map-licenses-to-statuses.js";

const config: ConfigType = {
  whitelist: ["MIT", "ISC"],
  blacklist: ["GPL-3.0-or-later", "AGPL-3.0-or-later"],
};

const baseLicense: Pick<
  LicenseWithSource,
  | "isDeprecatedLicenseId"
  | "isOsiApproved"
  | "seeAlso"
  | "detailsUrl"
  | "reference"
  | "name"
> = {
  isDeprecatedLicenseId: false,
  isOsiApproved: true,
  seeAlso: [],
  detailsUrl: "",
  reference: "",
  name: "",
};

const generateTestPackage = ({
  packageName,
  verificationStatus,
  licenses,
}: {
  packageName: string;
  licenses: (
    | {
        licenseId: LicenseId;
        source: LicenseSource;
      }
    | {
        licenseName: string;
      }
  )[];
  verificationStatus?: VerificationStatus;
}): [
  string,
  {
    packagePath: string;
    packageName: string;
    licensesWithPath: LicensesWithPathAndStatus;
  },
] => [
  packageName,
  {
    packagePath: `/path/to/${packageName}`,
    packageName,
    licensesWithPath: {
      licenses: licenses
        .filter((license) => "licenseId" in license)
        .map((license) => ({
          ...baseLicense,
          licenseId: license.licenseId,
          source: license.source,
        })),
      licensePath: licenses.map((license) => {
        if ("licenseName" in license) {
          return `/path/to/${packageName}/LICENSE-${license.licenseName}`;
        }
        if (license.source === "package.json-license") {
          return `/path/to/${packageName}/package.json`;
        }
        return `/path/to/${packageName}/LICENSE-${license.licenseId}`;
      }),
      verificationStatus,
    },
  },
];

const whitelistedPackage = generateTestPackage({
  packageName: "packageA",
  licenses: [
    { licenseId: "MIT", source: "package.json-license" },
    { licenseId: "MIT", source: "license-file-content" },
  ],
  verificationStatus: "ok",
});
const blacklistedPackage = generateTestPackage({
  packageName: "packageB",
  licenses: [
    { licenseId: "GPL-3.0-or-later", source: "package.json-license" },
    { licenseId: "GPL-3.0-or-later", source: "license-file-content" },
  ],
  verificationStatus: "ok",
});
const unknownPackage = generateTestPackage({
  packageName: "packageC",
  licenses: [
    { licenseId: "BSD-2-Clause", source: "package.json-license" },
    { licenseId: "BSD-2-Clause", source: "license-file-content" },
  ],
  verificationStatus: "ok",
});
const licenseFileNotFoundPackage = generateTestPackage({
  packageName: "packageD",
  licenses: [],
  verificationStatus: "licenseFileNotFound",
});
const onlyPackageJsonLicenseWhitelistedPackage = generateTestPackage({
  packageName: "packageE",
  licenses: [{ licenseId: "MIT", source: "package.json-license" }],
  verificationStatus: "licenseFileNotFound",
});
const onlyPackageJsonLicenseBlacklistedPackage = generateTestPackage({
  packageName: "packageF",
  licenses: [{ licenseId: "GPL-3.0-or-later", source: "package.json-license" }],
  verificationStatus: "licenseFileNotFound",
});

const onlyPackageJsonLicenseUnknownPackage = generateTestPackage({
  packageName: "packageG",
  licenses: [{ licenseId: "BSD-2-Clause", source: "package.json-license" }],
  verificationStatus: "licenseFileNotFound",
});

const unmatchedLicensePackage = generateTestPackage({
  packageName: "packageH",
  licenses: [],
  verificationStatus: "licenseFileExistsButUnknownLicense",
});

const licenseFilesExistButSomeAreUncertainPackage = generateTestPackage({
  packageName: "packageI",
  licenses: [
    { licenseId: "MIT", source: "package.json-license" },
    { licenseId: "MIT", source: "license-file-content" },
    { licenseName: "UnmatchedLicense" },
  ],
  verificationStatus: "licenseFilesExistButSomeAreUncertain",
});

const someButNotAllLicensesWhitelistedPackage = generateTestPackage({
  packageName: "packageJ",
  licenses: [
    { licenseId: "MIT", source: "package.json-license" },
    { licenseId: "MIT", source: "license-file-content" },
    { licenseId: "GPL-3.0-or-later", source: "package.json-license" },
    { licenseId: "GPL-3.0-or-later", source: "license-file-content" },
  ],
  verificationStatus: "ok",
});

const matchedByKeywordsPackage = generateTestPackage({
  packageName: "packageK",
  licenses: [
    { licenseId: "MIT", source: "package.json-license" },
    { licenseId: "MIT", source: "license-file-content-keywords" },
  ],
  verificationStatus: "ok",
});

describe("mapLicensesToStatus", () => {
  it("should correctly map whitelisted package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      whitelistedPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([
      expect.objectContaining({
        packageName: whitelistedPackage[0],
        packagePath: whitelistedPackage[1].packagePath,
      }),
    ]);
    expect(result.groupedByStatus.blacklist).toEqual([]);
    expect(result.groupedByStatus.unknown).toEqual([]);
    expect([...result.notFound.entries()]).toEqual([]);
    expect([...result.needsUserVerification.entries()]).toEqual([]);
  });

  it("should correctly map blacklisted package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      blacklistedPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([]);
    expect(result.groupedByStatus.blacklist).toEqual([
      expect.objectContaining({
        packageName: blacklistedPackage[0],
        packagePath: blacklistedPackage[1].packagePath,
      }),
    ]);
    expect(result.groupedByStatus.unknown).toEqual([]);
    expect([...result.notFound.entries()]).toEqual([]);
    expect([...result.needsUserVerification.entries()]).toEqual([]);
  });

  it("should correctly map unknown package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      unknownPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([]);
    expect(result.groupedByStatus.blacklist).toEqual([]);
    expect(result.groupedByStatus.unknown).toEqual([
      expect.objectContaining({
        packageName: unknownPackage[0],
        packagePath: unknownPackage[1].packagePath,
      }),
    ]);
  });

  it("should correctly map license file not found package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      licenseFileNotFoundPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([]);
    expect(result.groupedByStatus.blacklist).toEqual([]);
    expect(result.groupedByStatus.unknown).toEqual([]);
    expect([...result.notFound.entries()]).toEqual([
      [
        licenseFileNotFoundPackage[0],
        {
          packagePath: licenseFileNotFoundPackage[1].packagePath,
          errorMessage: `License not found in package.json and in license file in ${licenseFileNotFoundPackage[1].packagePath}`,
        },
      ],
    ]);
    expect([...result.needsUserVerification.entries()]).toEqual([]);
  });

  it("should correctly map only package.json license whitelisted package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      onlyPackageJsonLicenseWhitelistedPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([
      expect.objectContaining({
        packageName: onlyPackageJsonLicenseWhitelistedPackage[0],
        packagePath: onlyPackageJsonLicenseWhitelistedPackage[1].packagePath,
      }),
    ]);
    expect(result.groupedByStatus.blacklist).toEqual([]);
    expect(result.groupedByStatus.unknown).toEqual([]);
    expect([...result.notFound.entries()]).toEqual([]);
    expect([...result.needsUserVerification.entries()]).toEqual([]);
  });

  it("should correctly map only package.json license blacklisted package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      onlyPackageJsonLicenseBlacklistedPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([]);
    expect(result.groupedByStatus.blacklist).toEqual([
      expect.objectContaining({
        packageName: onlyPackageJsonLicenseBlacklistedPackage[0],
        packagePath: onlyPackageJsonLicenseBlacklistedPackage[1].packagePath,
      }),
    ]);
    expect(result.groupedByStatus.unknown).toEqual([]);
    expect([...result.notFound.entries()]).toEqual([]);
    expect([...result.needsUserVerification.entries()]).toEqual([]);
  });

  it("should correctly map only package.json license unknown package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      onlyPackageJsonLicenseUnknownPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([]);
    expect(result.groupedByStatus.blacklist).toEqual([]);
    expect(result.groupedByStatus.unknown).toEqual([
      expect.objectContaining({
        packageName: onlyPackageJsonLicenseUnknownPackage[0],
        packagePath: onlyPackageJsonLicenseUnknownPackage[1].packagePath,
      }),
    ]);
    expect([...result.notFound.entries()]).toEqual([]);
    expect([...result.needsUserVerification.entries()]).toEqual([]);
  });

  it("should correctly map unmatched license package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      unmatchedLicensePackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([]);
    expect(result.groupedByStatus.blacklist).toEqual([]);
    expect(result.groupedByStatus.unknown).toEqual([]);
    expect([...result.notFound.entries()]).toEqual([
      [
        unmatchedLicensePackage[0],
        {
          packagePath: unmatchedLicensePackage[1].packagePath,
          errorMessage: `License not found in package.json and in license file in ${unmatchedLicensePackage[1].packagePath}`,
        },
      ],
    ]);
    expect([...result.needsUserVerification.entries()]).toEqual([]);
  });

  it("should correctly map some but not all licenses whitelisted package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      someButNotAllLicensesWhitelistedPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([]);

    expect(result.groupedByStatus.blacklist).toEqual([
      expect.objectContaining({
        packageName: someButNotAllLicensesWhitelistedPackage[0],
        packagePath: someButNotAllLicensesWhitelistedPackage[1].packagePath,
      }),
    ]);
    expect(result.groupedByStatus.unknown).toEqual([]);
    expect([...result.notFound.entries()]).toEqual([]);
    expect([...result.needsUserVerification.entries()]).toEqual([
      [
        someButNotAllLicensesWhitelistedPackage[0],
        {
          packagePath: someButNotAllLicensesWhitelistedPackage[1].packagePath,
          verificationMessage: `Some but not all licenses are whitelisted for package ${someButNotAllLicensesWhitelistedPackage[0]} in path ${someButNotAllLicensesWhitelistedPackage[1].packagePath}. Please review the package.`,
        },
      ],
    ]);
  });

  it("should correctly map matched by keywords package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      matchedByKeywordsPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([
      expect.objectContaining({
        packageName: matchedByKeywordsPackage[0],
        packagePath: matchedByKeywordsPackage[1].packagePath,
      }),
    ]);
    expect(result.groupedByStatus.blacklist).toEqual([]);
    expect(result.groupedByStatus.unknown).toEqual([]);
    expect([...result.notFound.entries()]).toEqual([]);
    expect([...result.needsUserVerification.entries()]).toEqual([]);
  });

  it("should correctly map license files exist but some are uncertain package", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      licenseFilesExistButSomeAreUncertainPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist).toEqual([]);
    expect(result.groupedByStatus.blacklist).toEqual([]);
    expect(result.groupedByStatus.unknown).toEqual([]);
    expect([...result.notFound.entries()]).toEqual([]);
    expect([...result.needsUserVerification.entries()]).toEqual([
      [
        licenseFilesExistButSomeAreUncertainPackage[0],
        {
          packagePath:
            licenseFilesExistButSomeAreUncertainPackage[1].packagePath,
          verificationMessage: `We've found few license files, but we could not match a license for some of them for package ${licenseFilesExistButSomeAreUncertainPackage[0]} in path ${licenseFilesExistButSomeAreUncertainPackage[1].packagePath}. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
        },
      ],
    ]);
  });

  it("should correctly map when with combinations", async () => {
    const packageLicensesWithPath: PackageLicensesWithPath = new Map([
      whitelistedPackage,
      blacklistedPackage,
      unknownPackage,
      licenseFileNotFoundPackage,
      onlyPackageJsonLicenseWhitelistedPackage,
      onlyPackageJsonLicenseBlacklistedPackage,
      onlyPackageJsonLicenseUnknownPackage,
      unmatchedLicensePackage,
      licenseFilesExistButSomeAreUncertainPackage,
      someButNotAllLicensesWhitelistedPackage,
      matchedByKeywordsPackage,
    ]);

    const result = await mapLicensesToStatus(packageLicensesWithPath, config);

    expect(result.groupedByStatus.whitelist.length).toEqual(3);
    expect(result.groupedByStatus.whitelist).toEqual([
      expect.objectContaining({
        packageName: whitelistedPackage[0],
        packagePath: whitelistedPackage[1].packagePath,
      }),
      expect.objectContaining({
        packageName: onlyPackageJsonLicenseWhitelistedPackage[0],
        packagePath: onlyPackageJsonLicenseWhitelistedPackage[1].packagePath,
      }),
      expect.objectContaining({
        packageName: matchedByKeywordsPackage[0],
        packagePath: matchedByKeywordsPackage[1].packagePath,
      }),
    ]);

    expect(result.groupedByStatus.blacklist.length).toEqual(3);
    expect(result.groupedByStatus.blacklist).toEqual([
      expect.objectContaining({
        packageName: blacklistedPackage[0],
        packagePath: blacklistedPackage[1].packagePath,
      }),
      expect.objectContaining({
        packageName: onlyPackageJsonLicenseBlacklistedPackage[0],
        packagePath: onlyPackageJsonLicenseBlacklistedPackage[1].packagePath,
      }),
      expect.objectContaining({
        packageName: someButNotAllLicensesWhitelistedPackage[0],
        packagePath: someButNotAllLicensesWhitelistedPackage[1].packagePath,
      }),
    ]);

    expect(result.groupedByStatus.unknown.length).toEqual(2);
    expect(result.groupedByStatus.unknown).toEqual([
      expect.objectContaining({
        packageName: unknownPackage[0],
        packagePath: unknownPackage[1].packagePath,
      }),
      expect.objectContaining({
        packageName: onlyPackageJsonLicenseUnknownPackage[0],
        packagePath: onlyPackageJsonLicenseUnknownPackage[1].packagePath,
      }),
    ]);

    expect([...result.notFound.entries()]).toEqual([
      [
        licenseFileNotFoundPackage[0],
        {
          packagePath: licenseFileNotFoundPackage[1].packagePath,
          errorMessage: `License not found in package.json and in license file in ${licenseFileNotFoundPackage[1].packagePath}`,
        },
      ],
      [
        unmatchedLicensePackage[0],
        {
          packagePath: unmatchedLicensePackage[1].packagePath,
          errorMessage: `License not found in package.json and in license file in ${unmatchedLicensePackage[1].packagePath}`,
        },
      ],
    ]);
    expect([...result.needsUserVerification.entries()]).toEqual([
      [
        licenseFilesExistButSomeAreUncertainPackage[0],
        {
          packagePath:
            licenseFilesExistButSomeAreUncertainPackage[1].packagePath,
          verificationMessage: `We've found few license files, but we could not match a license for some of them for package ${licenseFilesExistButSomeAreUncertainPackage[0]} in path ${licenseFilesExistButSomeAreUncertainPackage[1].packagePath}. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.`,
        },
      ],
      [
        someButNotAllLicensesWhitelistedPackage[0],
        {
          packagePath: someButNotAllLicensesWhitelistedPackage[1].packagePath,
          verificationMessage: `Some but not all licenses are whitelisted for package ${someButNotAllLicensesWhitelistedPackage[0]} in path ${someButNotAllLicensesWhitelistedPackage[1].packagePath}. Please review the package.`,
        },
      ],
    ]);
  });
});
