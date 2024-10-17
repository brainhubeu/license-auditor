import * as fs from "node:fs";
import * as path from "node:path";
import { type License, licenses } from "@license-auditor/licenses";

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
    licenses.find((license) => license.licenseId === "BSD-2-Clause"),
  [fs.readFileSync(`${__dirname}/templates/MIT.txt`).toString()]: licenses.find(
    (license) => license.licenseId === "MIT",
  ),
};

function retrieveLicenseFromLicenseFileContent(
  content: string,
): License | License[] {
  const lines = content.split("\n");

  const contentTokens = content.split(/[ ,]+/);

  const licenseArr = licenses.filter(
    (license) =>
      contentTokens.includes(license.licenseId) ||
      contentTokens.includes(license.name),
  );

  const withoutFirstLine = lines
    .slice(1)
    .filter((line) => line.length)
    .join("\n");
  return templates[withoutFirstLine] || licenseArr;
}

export async function findLicenseInLicenseFile(
  filename: string,
): Promise<LicenseWithPath> {
  if (!fs.existsSync(filename)) {
    return { license: undefined, licensePath: undefined };
  }

  const content = await fs.promises.readFile(filename, "utf-8");

  if (!content) {
    return { license: undefined, licensePath: undefined };
  }
  const foundLicenses = retrieveLicenseFromLicenseFileContent(content);

  const license =
    Array.isArray(foundLicenses) && foundLicenses.length === 1
      ? foundLicenses[0]
      : foundLicenses;

  if (!license) {
    return { license: undefined, licensePath: undefined };
  }

  return {
    license,
    licensePath: filename,
    needsVerification: Array.isArray(license),
  };
}

export function parseLicenseFiles(
  packagePath: string,
): Promise<LicenseWithPath> | undefined {
  for (const licenseFile of licenseFiles) {
    const basicPath = path.join(packagePath, licenseFile);
    const licenseFromLicenseFile = findLicenseInLicenseFile(basicPath);
    if (licenseFromLicenseFile) {
      return licenseFromLicenseFile;
    }
  }
}
