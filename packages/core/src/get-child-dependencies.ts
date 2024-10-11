import * as fs from "node:fs";
import * as path from "node:path";

// solid wip, it's not pretty
export function getChildDependencies(
  packageJson: any,
  packagePath: string,
): string[] {
  const dependencies = packageJson.dependencies || {};
  const dependencyNames = Object.keys(dependencies);

  const childDependencies: string[] = [];

  for (const depName of dependencyNames) {
    let depPath: string | null = path.join(
      packagePath,
      "node_modules",
      depName,
    );

    if (!fs.existsSync(depPath)) {
      // traverse up the directory tree to handle hoisted dependencies
      let currentPath = packagePath;

      while (true) {
        const parentNodeModules = path.join(
          currentPath,
          "node_modules",
          depName,
        );
        if (fs.existsSync(parentNodeModules)) {
          depPath = parentNodeModules;
          break;
        }

        const parentDir = path.dirname(currentPath);
        if (parentDir === currentPath) {
          // Reached the root directory
          depPath = null;
          break;
        }
        currentPath = parentDir;
      }
    }

    if (depPath && fs.existsSync(depPath)) {
      childDependencies.push(depPath);
    } else {
      console.warn(
        `Could not find path for dependency "${depName}" of package "${packagePath}"`,
      );
    }
  }

  return childDependencies;
}
