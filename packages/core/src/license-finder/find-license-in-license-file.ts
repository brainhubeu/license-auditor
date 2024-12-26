import { readFile, readdir } from "node:fs/promises";
import * as path from "node:path";
import {
  LICENSE_SOURCE,
  LicenseSchema,
  type LicenseWithSource,
  licenseMap,
} from "@license-auditor/data";
import { addLicenseSource } from "./add-license-source.js";
import { detectLicenses } from "./detect-from-license-content.js";
import type { LicensesWithPathAndStatus } from "./licenses-with-path.js";

export function retrieveLicenseFromLicenseFileContent(content: string): {
  licenses: LicenseWithSource[];
} {
  const detectedLicenses = detectLicenses(content);
  const detectedLicense = detectedLicenses[0];
  if (detectedLicense && (detectedLicense.similarity ?? 0) > 0.75) {
    // threshold selected empirically based on our tests
    const foundLicense = licenseMap.get(detectedLicense.licenseId);
    if (!foundLicense) {
      throw new Error(`License detected but not found in license map: ${detectedLicense.licenseId}`);
    }

    return {
      licenses: addLicenseSource([LicenseSchema.parse(foundLicense)], LICENSE_SOURCE.licenseFileContent),
    };
  }

  const contentTokens = content.split(/[ ,]+/);

  const licenseArr = [...licenseMap]
    .filter(
      ([key, value]) =>
        contentTokens.includes(key) || contentTokens.includes(value.name),
    )
    .map((result) => LicenseSchema.parse(result[1]));

  return {
    licenses: addLicenseSource(
      licenseArr,
      LICENSE_SOURCE.licenseFileContextKeywords,
    ),
  };
}

export async function findLicenseInLicenseFile(filePath: string): Promise<{
  licenses: LicenseWithSource[];
}> {
  try {
    const content = await readFile(filePath, "utf-8");

    if (!content) {
      return {
        licenses: [],
      };
    }

    const result = retrieveLicenseFromLicenseFileContent(content);

    return {
      licenses: result.licenses,
    };
  } catch {
    return {
      licenses: [],
    };
  }
}

export async function parseLicenseFiles(
  packagePath: string,
): Promise<LicensesWithPathAndStatus> {
  const files = await readdir(packagePath);
  const licenseFiles = files.filter((file) =>
    /^LICENSE(-[\w.-]+)?(\.md|\.txt)?$/i.test(file),
  );

  if (licenseFiles.length === 0 || !licenseFiles[0]) {
    return {
      licenses: [],
      licensePath: [packagePath],
      verificationStatus: "licenseFileNotFound",
    };
  }

  if (licenseFiles.length > 1) {
    return handleMultipleLicenseFiles(licenseFiles, packagePath);
  }

  return handleSingleLicenseFile(licenseFiles[0], packagePath);
}

async function handleSingleLicenseFile(
  licenseFile: string,
  packagePath: string,
): Promise<LicensesWithPathAndStatus> {
  const licensePath = path.join(packagePath, licenseFile);
  const licenseFromLicenseFile = await findLicenseInLicenseFile(licensePath);

  if (licenseFromLicenseFile.licenses.length === 0) {
    return {
      licenses: [],
      licensePath: [licensePath],
      verificationStatus: "licenseFileExistsButUnknownLicense",
    };
  }

  return {
    licenses: licenseFromLicenseFile.licenses,
    licensePath: [licensePath],
    verificationStatus: "ok",
  };
}

async function handleMultipleLicenseFiles(
  licenseFiles: string[],
  packagePath: string,
): Promise<LicensesWithPathAndStatus> {
  const allLicenses: LicenseWithSource[] = [];
  let unknownOrUncertainLicensesFiles = 0; // number of license files that were not matched by the content, but only by the keywords or not at all, which is risky and potentially require manual verification

  for (const licenseFile of licenseFiles) {
    const licensePath = path.join(packagePath, licenseFile);
    const licenseFromLicenseFile = await findLicenseInLicenseFile(licensePath);
    if (
      licenseFromLicenseFile.licenses.some(
        (license) =>
          license.source === LICENSE_SOURCE.licenseFileContextKeywords,
      ) ||
      !licenseFromLicenseFile.licenses.length
    ) {
      unknownOrUncertainLicensesFiles++;
    }
    if (licenseFromLicenseFile.licenses.length > 0) {
      allLicenses.push(...licenseFromLicenseFile.licenses);
    }
  }

  const licensePaths = licenseFiles.map((file) => path.join(packagePath, file));

  if (allLicenses.length === 0) {
    return {
      licenses: [],
      licensePath: licensePaths,
      verificationStatus: "licenseFileExistsButUnknownLicense",
    };
  }

  return {
    licenses: allLicenses,
    licensePath: licensePaths,
    verificationStatus: unknownOrUncertainLicensesFiles
      ? "licenseFilesExistButSomeAreUncertain"
      : "ok",
  };
}
