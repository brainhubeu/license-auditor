import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { type License, LicenseSchema, licenseMap } from "@license-auditor/data";
import type { LicensesWithPath } from "./licenses-with-path.ts";

const licenseFiles = [
  "LICENSE",
  "LICENCE",
  "LICENSE.md",
  "LICENCE.md",
  "LICENSE.txt",
  "LICENSE-MIT",
  "LICENSE.BSD",
] as const;

function retrieveLicenseFromLicenseFileContent(content: string): License[] {
  const contentTokens = content.split(/[ ,]+/);

  const licenseArr = [...licenseMap]
    .filter(
      ([key, value]) =>
        contentTokens.includes(key) || contentTokens.includes(value.name),
    )
    .map((result) => LicenseSchema.parse(result[1]));

  return licenseArr;
}

export async function findLicenseInLicenseFile(
  filename: string,
): Promise<LicensesWithPath> {
  try {
    const content = await readFile(filename, "utf-8");

    if (!content) {
      return { licenses: [], licensePath: undefined };
    }
    const foundLicenses = retrieveLicenseFromLicenseFileContent(content);

    return {
      licenses: foundLicenses,
      licensePath: filename,
      needsVerification: foundLicenses.length !== 1,
    };
  } catch {
    return { licenses: [], licensePath: undefined };
  }
}

export async function parseLicenseFiles(
  packagePath: string,
): Promise<LicensesWithPath | undefined> {
  let licensePath: string;
  for (const licenseFile of licenseFiles) {
    licensePath = path.join(packagePath, licenseFile);
    const licenseFromLicenseFile = await findLicenseInLicenseFile(licensePath);
    if (licenseFromLicenseFile.licenses.length > 0) {
      return licenseFromLicenseFile;
    }
  }
}
