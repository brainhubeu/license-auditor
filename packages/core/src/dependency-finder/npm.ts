import { execCommand } from "./exec-command.ts";

export const findNpmDepsCommand = "npm ls --all -p";

export async function findNpmDependencies(
  projectRoot: string,
): Promise<string[]> {
  const output = await execCommand(findNpmDepsCommand, projectRoot);

  // Remove the first line, as npm always prints the project root first
  const lines = output.split("\n").slice(1);

  const dependencyPaths = lines
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim());

  return dependencyPaths;
}
