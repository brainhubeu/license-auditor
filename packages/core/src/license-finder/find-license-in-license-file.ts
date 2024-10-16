import * as fs from "node:fs";
import { licenses } from "../license/licenses";

const templates = {
  [fs.readFileSync(`${__dirname}/templates/BSD-2-Clause.txt`).toString()]:
    "BSD 2-Clause",
  [fs.readFileSync(`${__dirname}/templates/MIT.txt`).toString()]: "MIT",
};

function retrieveLicenseFromLicenseFileContent(
  content: string
): string | string[] {
  const lines = content.split("\n");

  const licenseArr = licenses.filter((license) => content.includes(license));

  if (!licenseArr.length) {
    return content;
  }

  const withoutFirstLine = lines
    .slice(1)
    .filter((line) => line.length)
    .join("\n");
  return templates[withoutFirstLine] || licenseArr;
}

export function findLicenseInLicenseFile(
  filename: string
): LicenseWithPath | undefined {
  if (!fs.existsSync(filename)) {
    return;
  }
  const content = fs.readFileSync(filename).toString();
  const foundLicenses = retrieveLicenseFromLicenseFileContent(content);

  const matchedLicenses = licenses.filter((license) =>
    foundLicenses.includes(license)
  );

  if (!matchedLicenses) {
    return;
  }

  return { license: matchedLicenses, licensePath: filename };
}
