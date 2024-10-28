import path from "node:path";
import fg from "fast-glob";
import { readPackageJson } from "../file-utils.ts";

interface PackageJson {
  name?: string;
}

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
      const packageJson = readPackageJson(
        path.dirname(fullPath),
      ) as PackageJson;
      return packageJson.name;
    }),
  );

  return internalPackages.filter(
    (name): name is string => typeof name === "string",
  );
}
