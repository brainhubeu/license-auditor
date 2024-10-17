import * as fs from "node:fs";
import { type License, licenses } from "@license-auditor/licenses";

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

export function findLicenseInLicenseFile(
  filename: string,
): LicenseWithPath | undefined {
  if (!fs.existsSync(filename)) {
    return;
  }
  const content = fs.readFileSync(filename).toString();
  const foundLicenses = retrieveLicenseFromLicenseFileContent(content);

  return {
    license:
      Array.isArray(foundLicenses) && foundLicenses.length === 1
        ? foundLicenses[0]
        : foundLicenses,
    licensePath: filename,
  };
}
