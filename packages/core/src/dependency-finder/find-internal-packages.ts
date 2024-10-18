import fs from "node:fs/promises";
import path from "node:path";
import { readPackageJson } from "../file-utils";

export async function findInternalPackages(
  projectRoot: string,
): Promise<string[]> {
  const internalPackages: string[] = [];

  async function searchDirectory(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && entry.name !== "node_modules") {
          await searchDirectory(fullPath);
        }

        if (entry.isFile() && entry.name === "package.json") {
          const packageJson = readPackageJson(path.dirname(fullPath));
          if ("name" in packageJson && typeof packageJson.name === "string") {
            internalPackages.push(packageJson.name);
          }
        }
      }),
    );
  }

  await searchDirectory(projectRoot);
  return internalPackages;
}
