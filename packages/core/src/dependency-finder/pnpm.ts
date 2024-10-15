import { execSync } from "child_process";

interface PnpmDependency {
  from: string;
  version: string;
  resolved?: string;
  path: string;
}

interface PnpmListDependenciesOutput {
  name: string;
  version: string;
  path: string;
  private: boolean;
  dependencies?: Record<string, PnpmDependency>;
  devDependencies?: Record<string, PnpmDependency>;
  unsavedDependencies?: Record<string, PnpmDependency>;
}

export function detectPnpmDependencies(projectRoot: string): string[] {
  try {
    const output = execSync("pnpm ls --json", {
      cwd: projectRoot,
      encoding: "utf-8",
    });

    const dependenciesList = JSON.parse(output) as PnpmListDependenciesOutput[];

    const dependencyPaths: string[] = [];

    // Extra check if the std output is a valid pnpm ls --json output
    if (Array.isArray(dependenciesList) && dependenciesList.length > 0) {
      if (dependenciesList[0]?.dependencies) {
        const paths = extractDependencyPaths(dependenciesList[0].dependencies);
        dependencyPaths.push(...paths);
      }

      if (dependenciesList[0]?.devDependencies) {
        const paths = extractDependencyPaths(
          dependenciesList[0].devDependencies
        );
        dependencyPaths.push(...paths);
      }
    }

    return dependencyPaths;
  } catch (error) {
    console.error("Error detecting pnpm dependencies:", error);
    return [];
  }
}

function extractDependencyPaths(
  packageInfo: Record<string, PnpmDependency>
): string[] {
  const paths: string[] = [];

  if (packageInfo) {
    for (const dep of Object.values(packageInfo) as any[]) {
      paths.push(dep.path);
    }
  }

  return paths;
}
