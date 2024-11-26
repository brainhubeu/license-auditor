import { readFile, readdir } from "node:fs/promises";
import * as path from "node:path";
import {
  type ConfigType,
  type License,
  LicenseSchema,
  licenseMap,
} from "@license-auditor/data";
import { checkLicenseStatus } from "../check-license-status.js";
import type { LicensesWithPath } from "./licenses-with-path.js";
import { detectLicenses } from './detect-from-license-content.js';

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
    }
  }
  const contentTokens = content.split(/[ ,]+/);

  const licenseArr = [...licenseMap]
    .filter(
      ([key, value]) =>
        contentTokens.includes(key) || contentTokens.includes(value.name),
    )
    .map((result) => LicenseSchema.parse(result[1]));

  return { licenses: licenseArr };
}

export function retrieveLicenseFromLicenseFileName(filePath: string): {
  licenses: License[];
} {
  const licenseNameMatch = filePath.match(/LICENSE-([^\/]+?)(\.md|\.txt)?$/i);
  if (!licenseNameMatch) {
    return { licenses: [] };
  }

  const licenseName = licenseNameMatch[1];

  if (!licenseName) {
    return { licenses: [] };
  }

  const foundLicense = [...licenseMap].find(
    ([key, value]) =>
      key.toLowerCase() === licenseName.toLowerCase() ||
      value.name.toLowerCase() === licenseName.toLowerCase(),
  );

  if (!foundLicense) {
    return { licenses: [] };
  }

  return {
    licenses: [LicenseSchema.parse(foundLicense[1])],
  };
}

export async function findLicenseInLicenseFile(filePath: string): Promise<{
  licenses: License[];
}> {
  try {
    const content = await readFile(filePath, "utf-8");

    if (!content) {
      return {
        licenses: [],
      };
    }

    let foundLicenses: License[] = [];

    if (/\/LICENSE(\.md|\.txt)?$/i.test(filePath)) {
      const result = retrieveLicenseFromLicenseFileContent(content);
      foundLicenses = result.licenses;
    } else if (/\/LICENSE-.+?(\.md|\.txt)?$/i.test(filePath)) {
      const result = retrieveLicenseFromLicenseFileName(filePath);
      foundLicenses = result.licenses;
    }

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
  config: ConfigType,
): Promise<LicensesWithPath | undefined> {
  const files = await readdir(packagePath);
  const licenseFiles = files.filter((file) =>
    /^LICENSE(-[\w.-]+)?(\.md|\.txt)?$/i.test(file),
  );

  if (licenseFiles.length === 0) {
    return {
      licenses: [],
      licensePath: packagePath,
      verificationStatus: "licenseNotFound",
    };
  }

  if (licenseFiles.length > 1) {
    return handleMultipleLicenseFiles(licenseFiles, packagePath, config);
  }

  if (licenseFiles[0]) {
    return handleSingleLicenseFile(licenseFiles[0], packagePath);
  }

  return {
    licenses: [],
    licensePath: packagePath,
    verificationStatus: "licenseFileExistsButNoLicense",
  };
}

async function handleSingleLicenseFile(
  licenseFile: string,
  packagePath: string,
): Promise<LicensesWithPath> {
  const licensePath = path.join(packagePath, licenseFile);
  const licenseFromLicenseFile = await findLicenseInLicenseFile(licensePath);

  if (licenseFromLicenseFile.licenses.length === 0) {
    return {
      licenses: [],
      licensePath: licensePath,
      verificationStatus: "licenseFileExistsButNoLicense",
    };
  }

  return {
    licenses: licenseFromLicenseFile.licenses,
    licensePath: licensePath,
    verificationStatus: "ok",
  };
}

async function handleMultipleLicenseFiles(
  licenseFiles: string[],
  packagePath: string,
  config: ConfigType,
): Promise<LicensesWithPath> {
  const allLicenses: License[] = [];

  for (const licenseFile of licenseFiles) {
    const licensePath = path.join(packagePath, licenseFile);
    const licenseFromLicenseFile = await findLicenseInLicenseFile(licensePath);
    if (licenseFromLicenseFile.licenses.length > 0) {
      allLicenses.push(...licenseFromLicenseFile.licenses);
    }
  }

  if (allLicenses.length === 0) {
    return {
      licenses: [],
      licensePath: packagePath,
      verificationStatus: "licenseNotFound",
    };
  }

  if (allLicenses.length < licenseFiles.length) {
    return {
      licenses: allLicenses,
      licensePath: packagePath,
      verificationStatus: "notAllLicensesFound",
    };
  }

  const allLicensesWhitelisted = allLicenses.every((license) => {
    const licenseStatus = checkLicenseStatus(license, config);
    return licenseStatus === "whitelist";
  });

  if (!allLicensesWhitelisted) {
    return {
      licenses: allLicenses,
      licensePath: packagePath,
      verificationStatus: "notAllLicensesWhitelisted",
    };
  }

  return {
    licenses: allLicenses,
    licensePath: packagePath,
    verificationStatus: "ok",
  };
}
