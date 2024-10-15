import { execCommand } from "./exec-command";
import path from "path";
import fs from "fs";

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

export function detectYarnClassicDependencies(projectRoot: string): string[] {
  try {
    const output = execCommand("yarn list --depth=0 --json -R", projectRoot);
    const dependenciesList = JSON.parse(output) as YarnListOutput;

    const dependencyPaths: string[] = [];

    // Extra check if the std output is a valid yarn list --depth=0 --json -R output
    if (
      dependenciesList.type === "tree" &&
      Array.isArray(dependenciesList.data.trees)
    ) {
      dependencyPaths.push(
        ...extractDependencyPaths(dependenciesList.data.trees, projectRoot)
      );
    }

    return dependencyPaths;
  } catch (error) {
    throw new Error("Error detecting Yarn Classic dependencies");
  }
}

function extractDependencyPaths(
  dependencies: YarnDependency[],
  projectRoot: string
): string[] {
  return dependencies
    .map((dep) => {
      const packageName = dep.name.split("@").slice(0, -1).join("@");
      const dependencyPath = path.join(
        projectRoot,
        "node_modules",
        packageName
      );
      try {
        fs.accessSync(dependencyPath);
        return dependencyPath;
      } catch (error) {
        return null;
      }
    })
    .filter((path): path is string => path !== null);
}
