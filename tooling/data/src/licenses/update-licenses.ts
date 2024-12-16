import { writeFileSync } from "node:fs";

const url =
  "https://raw.githubusercontent.com/spdx/license-list-data/main/json/licenses.json";
const outputFile = "./src/licenses/licenses.ts";

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

// pulls the licenses from spdx and transforms them into an object
// needed so TS can properly infer types in union types
(async () => {
  try {
    console.log("Fetching license list...");
    const response = await fetch(url);
    const licensesData = (await response.json()) as {
      licenses: {
        licenseId: string;
        detailsUrl: string;
        licenseText?: string | null;
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
          )
        ) {
          const licenseData =
            (await // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
            (await fetch(licensesData.licenses[i]!.detailsUrl)).json()) as {
              licenseText: string;
            };
          // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
          licensesData.licenses[i]!.licenseText = licenseData.licenseText;
        } else {
          // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
          licensesData.licenses[i]!.licenseText = null;
        }
      } catch (error) {
        console.log(
          // biome-ignore lint/style/noNonNullAssertion: we can be sure that the licenses field is a dense array
          `Failed to fetch license contents for "${licensesData.licenses[i]!.licenseId}"`,
        );
        failedFetches++;
      }
    }

    const content = `export const licensesData = ${JSON.stringify(licensesData, null, 2)} as const;`;

    writeFileSync(outputFile, content);
    console.log(
      `licenses.ts has been updated.${failedFetches ? ` ${failedFetches} licenses failed to fetch.` : ""}`,
    );
  } catch (error) {
    console.error("Error fetching licenses:", error);
    process.exit(1);
  }
})();
