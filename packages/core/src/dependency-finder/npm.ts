import { execCommand } from "./exec-command";

export function detectNpmDependencies(projectRoot: string): string[] {
  try {
    const output = execCommand("npm ls --all -p", projectRoot);

    // Remove the first line, as npm always prints the project root first
    const lines = output.split("\n").slice(1);

    const dependencyPaths = lines
      .filter((line) => line.trim() !== "")
      .map((line) => line.trim());

    return dependencyPaths;
  } catch (error) {
    throw new Error("Error detecting npm dependencies");
  }
}
