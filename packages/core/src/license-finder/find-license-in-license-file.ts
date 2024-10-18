import fs, { promises as asyncFS } from "node:fs";
import * as path from "node:path";
import { type License, licenseMap } from "@license-auditor/licenses";
import { LicensesWithPath } from "./licenses-with-path";

const licenseFiles = [
  "LICENSE",
  "LICENCE",
  "LICENSE.md",
  "LICENCE.md",
  "LICENSE.txt",
  "LICENSE-MIT",
  "LICENSE.BSD",
] as const;

const templates = {
  [fs.readFileSync(`${__dirname}/templates/BSD-2-Clause.txt`).toString()]:
    licenseMap.get("BSD-2-Clause"),
  [fs.readFileSync(`${__dirname}/templates/MIT.txt`).toString()]:
    licenseMap.get("MIT"),
};

function retrieveLicenseFromLicenseFileContent(content: string): License[] {
  const lines = content.split("\n");

  const contentTokens = content.split(/[ ,]+/);

  const licenseArr = [...licenseMap]
    .filter(
      ([key, value]) =>
        contentTokens.includes(key) || contentTokens.includes(value.name)
    )
    .map((result) => result[1]);

  const withoutFirstLine = lines
    .slice(1)
    .filter((line) => line.length)
    .join("\n");

  const fromTemplate = templates[withoutFirstLine];

  if (fromTemplate) {
    return [fromTemplate];
  }

  return licenseArr;
}

export async function findLicenseInLicenseFile(
  filename: string
): Promise<LicensesWithPath> {
  if (!fs.existsSync(filename)) {
    return { licenses: [], licensePath: undefined };
  }

  console.log(filename);

  const content = await asyncFS.readFile(filename, "utf-8");

  if (!content) {
    return { licenses: [], licensePath: undefined };
  }
  const foundLicenses = retrieveLicenseFromLicenseFileContent(content);

  if (!foundLicenses) {
    return { licenses: [], licensePath: undefined };
  }

  return {
    licenses: foundLicenses,
    licensePath: filename,
  };
}

export function parseLicenseFiles(
  packagePath: string
): Promise<LicensesWithPath> | undefined {
  for (const licenseFile of licenseFiles) {
    const basicPath = path.join(packagePath, licenseFile);
    console.log(basicPath);
    const licenseFromLicenseFile = findLicenseInLicenseFile(basicPath);
    if (licenseFromLicenseFile) {
      return licenseFromLicenseFile;
    }
  }
}
