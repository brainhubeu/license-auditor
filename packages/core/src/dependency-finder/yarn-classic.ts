import fs from "node:fs/promises";
import path from "node:path";
import { execCommand } from "./exec-command";

interface YarnDependency {
  name: string;
  children: YarnDependency[];
  hint: string | null;
  color: string | null;
  depth: number;
}

interface YarnListOutput {
  type: "tree";
  data: {
    type: "list";
    trees: YarnDependency[];
  };
}

export async function detectYarnClassicDependencies(
  projectRoot: string,
): Promise<string[]> {
  try {
    const output = execCommand("yarn list --depth=0 --json -R", projectRoot);
    const dependenciesList = JSON.parse(output) as YarnListOutput;

    // Extra check if the std output is a valid yarn list --depth=0 --json -R output
    if (
      dependenciesList.type === "tree" &&
      Array.isArray(dependenciesList.data.trees)
    ) {
      return await extractDependencyPaths(
        dependenciesList.data.trees,
        projectRoot,
      );
    }

    return [];
  } catch (error) {
    throw new Error("Error detecting Yarn Classic dependencies");
  }
}

async function extractDependencyPaths(
  dependencies: YarnDependency[],
  projectRoot: string,
): Promise<string[]> {
  const dependencyPaths = await Promise.all(
    dependencies.map(async (dep) => {
      const packageName = dep.name.split("@").slice(0, -1).join("@");
      const dependencyPath = path.join(
        projectRoot,
        "node_modules",
        packageName,
      );
      try {
        await fs.access(dependencyPath);
        return dependencyPath;
      } catch (error) {
        return null;
      }
    }),
  );

  return dependencyPaths.filter((path): path is string => path !== null);
}
