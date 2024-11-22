import { execCommand } from "./exec-command.js";

export const findNpmDepsCommand = "npm ls --all -p";
export const findNpmProdDepsCommand = "npm ls --all -p --omit=dev";

export async function findNpmDependencies(
  projectRoot: string,
  production?: boolean | undefined,
): Promise<string[]> {
  const output = await execCommand(
    production ? findNpmProdDepsCommand : findNpmDepsCommand,
    projectRoot,
  );

  // Remove the first line, as npm always prints the project root first
  const lines = output.split("\n").slice(1);

  const dependencyPaths = lines
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim());

  return dependencyPaths;
}
