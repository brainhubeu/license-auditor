import path from "node:path";
import fg from "fast-glob";
import { readPackageJson } from "../file-utils.js";

export async function findInternalPackages(
  projectRoot: string,
): Promise<string[]> {
  const entries = await fg(
    ["**/package.json", "!**/node_modules/**", "!package.json"],
    {
      cwd: projectRoot,
    },
  );

  const internalPackages = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(projectRoot, entry);

      const packageJsonResult = readPackageJson(path.dirname(fullPath));

      if (packageJsonResult.success) {
        return packageJsonResult.packageJson.name;
      }
      return undefined;
    }),
  );

  return internalPackages.filter((name) => typeof name === "string");
}
