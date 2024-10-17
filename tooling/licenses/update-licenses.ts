import { writeFileSync } from "node:fs";

const url =
  "https://raw.githubusercontent.com/spdx/license-list-data/main/json/licenses.json";
const outputFile = "./licenses.ts";

// pulls the licenses from spdx and transforms them into an object
// needed so TS can properly infer types in union types
(async () => {
  try {
    const response = await fetch(url);
    const licensesData = await response.json();

    const content = `export const licensesData = ${JSON.stringify(licensesData, null, 2)} as const;`;

    writeFileSync(outputFile, content);
    console.log("licenses.ts has been updated.");
  } catch (error) {
    console.error("Error fetching licenses:", error);
    process.exit(1);
  }
})();
