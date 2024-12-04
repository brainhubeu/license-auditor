import { readFile, readdir } from "node:fs/promises";
import * as path from "node:path";
import {
  LICENSE_SOURCE,
  type License,
  LicenseSchema,
  type LicenseWithSource,
  licenseMap,
} from "@license-auditor/data";
import { addLicenseSource } from "./add-license-source.js";
import { detectLicenses } from "./detect-from-license-content.js";
import type { LicensesWithPathAndStatus } from "./licenses-with-path.js";

export function retrieveLicenseFromLicenseFileContent(content: string): {
  licenses: License[];
} {
  const detectedLicenses = detectLicenses(content);
  const detectedLicense = detectedLicenses[0];
  if (detectedLicense && (detectedLicense.similarity ?? 0) > 0.75) {
    const licenseArr = [...licenseMap]
      .filter(([key]) => key === detectedLicense.licenseId)
      .map((result) => LicenseSchema.parse(result[1]));
    return {
      licenses: licenseArr,
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
    licenses: addLicenseSource(licenseArr, LICENSE_SOURCE.licenseFileContent),
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

    let foundLicenses: LicenseWithSource[] = [];

    const result = retrieveLicenseFromLicenseFileContent(content);
    foundLicenses = result.licenses.map((license) => ({
      ...license,
      source: LICENSE_SOURCE.licenseFileContent,
    }));

    return {
      licenses: foundLicenses,
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

  if (licenseFiles.length === 0) {
    return {
      licenses: [],
      licensePath: [packagePath],
      verificationStatus: "licenseFileNotFound",
    };
  }

  if (licenseFiles.length > 1) {
    return handleMultipleLicenseFiles(licenseFiles, packagePath);
  }

  if (licenseFiles[0]) {
    return handleSingleLicenseFile(licenseFiles[0], packagePath);
  }

  return {
    licenses: [],
    licensePath: [packagePath],
    verificationStatus: "licenseFileNotFound",
  };
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

  for (const licenseFile of licenseFiles) {
    const licensePath = path.join(packagePath, licenseFile);
    const licenseFromLicenseFile = await findLicenseInLicenseFile(licensePath);
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

  if (allLicenses.length < licenseFiles.length) {
    return {
      licenses: allLicenses,
      licensePath: licensePaths,
      verificationStatus: "notAllLicensesFoundInFile",
    };
  }

  return {
    licenses: allLicenses,
    licensePath: licensePaths,
    verificationStatus: "ok",
  };
}
