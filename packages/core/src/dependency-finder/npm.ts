import { execSync } from "child_process";

export function detectNpmDependencies(projectRoot: string): string[] {
  try {
    const output = execSync("npm ls --all -p", {
      cwd: projectRoot,
      encoding: "utf-8",
    });

    // Remove the first line, as npm always prints the project root first
    const lines = output.split("\n").slice(1);

    const dependencyPaths = lines
      .filter((line) => line.trim() !== "")
      .map((line) => line.trim());

    return dependencyPaths;
  } catch (error) {
    console.error("Error detecting npm dependencies:", error);
    return [];
  }
}
