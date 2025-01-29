import * as fs from "node:fs/promises";
import * as path from "node:path";

const url =
  "https://raw.githubusercontent.com/spdx/license-list-data/main/json/licenses.json";
const outputFile = "./src/licenses/licenses.ts";
const licenseCacheDirectory = "./license-cache";

// licenses are chosen arbitrarily, based on their popularity in our projects
const licensesToFetchContentFor = [
  "MIT",
  "ISC",
  "Apache-2.0",
  "BSD-3-Clause",
  "BSD-2-Clause",
  "CC0-1.0",
  "CC-BY-3.0",
  "CC-BY-4.0",
  "WTFPL",
  "0BSD",
  "Python-2.0",
  "MIT-0",
  "BlueOak-1.0.0",
  "Unlicense",
  "AAL",
  "GPL-3.0-or-later",
  "Zlib",
  "MPL-2.0",
];
const LOAD_ALL_LICENSES = true;

const getCachedLicenseData = async (licenseId: string, detailsUrl: string) => {
  let cachedLicenseData: {
    licenseText: string;
    standardLicenseTemplate: string;
  } | null = null;
  try {
    cachedLicenseData = JSON.parse(
      await fs.readFile(path.join(licenseCacheDirectory, licenseId), "utf-8"),
    );
  } catch (error) {}
  if (!cachedLicenseData) {
    console.log(`No cache for ${licenseId}`);
    const licenseData = (await (await fetch(detailsUrl)).json()) as {
      licenseText: string;
      standardLicenseTemplate: string;
    };

    await fs.mkdir(licenseCacheDirectory, { recursive: true });
    await fs.writeFile(
      path.join(licenseCacheDirectory, licenseId),
      JSON.stringify(licenseData),
    );

    return licenseData;
  }

  return cachedLicenseData;
};

// pulls the licenses from spdx and transforms them into an object
// needed so TS can properly infer types in union types
(async () => {
  try {
    console.log("Fetching license list...");
    const response = await fetch(url);
    const licensesData = (await response.json()) as {
      licenses: {
        name: string;
        licenseId: string;
        detailsUrl: string;
        licenseText?: string | null;
        standardLicenseTemplate?: string | null;
      }[];
    };

    let failedFetches = 0;
    for (let i = 0; i < licensesData.licenses.length; i++) {
      console.log(
        `Fetching license contents (${i + 1}/${licensesData.licenses.length})`,
      );
      try {
        if (
          licensesToFetchContentFor.includes(
            // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
            licensesData.licenses[i]!.licenseId,
          ) ||
          LOAD_ALL_LICENSES
        ) {
          const licenseData = await getCachedLicenseData(
            // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
            licensesData.licenses[i]!.licenseId,
            // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
            licensesData.licenses[i]!.detailsUrl,
          );
          // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
          licensesData.licenses[i]!.licenseText = licenseData.licenseText;
          // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
          licensesData.licenses[i]!.standardLicenseTemplate =
            licenseData.standardLicenseTemplate;
        } else {
          // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
          licensesData.licenses[i]!.licenseText = null;
        }
      } catch (error) {
        console.log(
          `Failed to fetch license contents for "${
            // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
            licensesData.licenses[i]!.licenseId
          }"`,
        );
        failedFetches++;
      }
    }

    const knownLicenseIds = licensesData.licenses
      .map((license) => `"${license.licenseId.replace(/"/g, '\\"')}"`)
      .join(" | ");
    const knownLicenseNames = licensesData.licenses
      .map((license) => `"${license.name.replace(/"/g, '\\"')}"`)
      .join(" | ");

    const content = `type LicenseData = {
  reference: string;
  isDeprecatedLicenseId: boolean;
  detailsUrl: string;
  referenceNumber: number;
  name: ${knownLicenseNames};
  licenseId: ${knownLicenseIds};
  seeAlso: string[];
  isOsiApproved: boolean;
  isFsfLibre?: boolean;
  licenseText?: string | null;
  standardLicenseTemplate?: string | null;    
};
export const licensesData: { licenseListVersion: string, licenses: LicenseData[], releaseDate: string } = ${JSON.stringify(
      licensesData,
      null,
      2,
    )} as const;`;

    await fs.writeFile(outputFile, content);
    console.log(
      `licenses.ts has been updated.${
        failedFetches ? ` ${failedFetches} licenses failed to fetch.` : ""
      }`,
    );
  } catch (error) {
    console.error("Error fetching licenses:", error);
    process.exit(1);
  }
})();
