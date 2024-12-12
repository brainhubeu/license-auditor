import * as fs from "node:fs/promises";
import * as path from "node:path";

export async function getLicenseContent(licenseName: string) {
  const licenseContent = await fs.readFile(
    path.resolve("licenses", `LICENSE-${licenseName}`),
    "utf8",
  );
  if (!licenseContent) {
    throw new Error(`License "${licenseName}" not found or empty`);
  }
  return licenseContent;
}
