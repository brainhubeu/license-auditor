import * as fs from "node:fs";
import { licenses } from "../license/licenses";

const licenseMap: Record<string, string> = {
  "(The MIT License)": "MIT",
  "Apache License": "Apache",
  "ISC License": "MIT",
  "MIT License": "MIT",
  "The ISC License": "ISC",
  "The MIT License (MIT)": "MIT",
  "The MIT License (MIT)^M": "MIT",
  "The MIT License": "MIT",
  "This software is released under the MIT license:": "MIT",
};

const templates = {
  [fs.readFileSync(`${__dirname}/templates/BSD-2-Clause.txt`).toString()]:
    "BSD 2-Clause",
  [fs.readFileSync(`${__dirname}/templates/MIT.txt`).toString()]: "MIT",
};

function retrieveLicenseFromLicenseFileContent(content: string): string {
  const lines = content.split("\n");
  const license = lines.find((line) => /license/i.test(line));

  if (!license) {
    return "";
  }
  const mapped = licenseMap[license.trim()];
  if (mapped) {
    mapped;
  }
  const withoutFirstLine = lines
    .slice(1)
    .filter((line) => line.length)
    .join("\n");
  return templates[withoutFirstLine] || content;
}

// todo: re-implement logic responsible for searching for license in license files
export function findLicenseInLicenseFile(
  filename: string
): LicenseWithPath | undefined {
  if (!fs.existsSync(filename)) {
    return;
  }
  const content = fs.readFileSync(filename).toString();
  const foundLicense = retrieveLicenseFromLicenseFileContent(content);

  const matchedLicense = licenses.find((license) => license === foundLicense);

  if (!matchedLicense) {
    return;
  }

  return { license: matchedLicense, licensePath: filename };
}
