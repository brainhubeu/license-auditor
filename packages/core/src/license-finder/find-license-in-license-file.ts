import { readFile, readdir } from "node:fs/promises";
import * as path from "node:path";
import {
  LICENSE_SOURCE,
  type License,
  LicenseSchema,
  type LicenseWithSource,
  licenseMap,
} from "@license-auditor/data";
// import { checkLicenseStatus } from "../check-license-status.js";
import { addLicenseSource } from "./add-license-source.js";
import type { LicensesWithPathAndStatus } from "./licenses-with-path.js";

export function retrieveLicenseFromLicenseFileContent(content: string): {
  licenses: License[];
} {
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
    licenses: addLicenseSource(
      [LicenseSchema.parse(foundLicense[1])],
      LICENSE_SOURCE.licenseFileName,
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

    let foundLicenses: LicenseWithSource[] = [];

    if (/\/LICENSE(\.md|\.txt)?$/i.test(filePath)) {
      const result = retrieveLicenseFromLicenseFileContent(content);
      foundLicenses = result.licenses.map((license) => ({
        ...license,
        source: LICENSE_SOURCE.licenseFileContent,
      }));
    } else if (/\/LICENSE-.+?(\.md|\.txt)?$/i.test(filePath)) {
      const result = retrieveLicenseFromLicenseFileName(filePath);
      foundLicenses = result.licenses.map((license) => ({
        ...license,
        source: LICENSE_SOURCE.licenseFileName,
      }));
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
  // config: ConfigType,
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
    // return handleMultipleLicenseFiles(licenseFiles, packagePath, config);
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
      verificationStatus: "licenseFileExistsButNoLicense",
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
  // config: ConfigType,
): Promise<LicensesWithPathAndStatus> {
  const allLicenses: LicenseWithSource[] = [];

  for (const licenseFile of licenseFiles) {
    const licensePath = path.join(packagePath, licenseFile);
    const licenseFromLicenseFile = await findLicenseInLicenseFile(licensePath);
    if (licenseFromLicenseFile.licenses.length > 0) {
      allLicenses.push(...licenseFromLicenseFile.licenses);
    }
  }

  // return {
  // 	licenses: allLicenses,
  // 	licensePath: licenseFiles.map((file) => path.join(packagePath, file)),
  // 	verificationStatus: "ok",
  // };

  const licensePaths = licenseFiles.map((file) => path.join(packagePath, file));

  if (allLicenses.length === 0) {
    return {
      licenses: [],
      licensePath: licensePaths,
      verificationStatus: "licenseNotFoundInFile",
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
