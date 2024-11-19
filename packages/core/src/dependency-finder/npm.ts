import { CommandExecutionError } from "../errors.js";
import { execCommand } from "./exec-command.js";

export const findNpmDepsCommand = "npm ls --all -p";

export async function findNpmDependencies(
  projectRoot: string,
): Promise<{ dependencyPaths: string[]; warning?: string }> {
  const { output, warning } = await (async () => {
    try {
      return { output: await execCommand(findNpmDepsCommand, projectRoot) };
    } catch (error) {
      if (error instanceof CommandExecutionError) {
        if (/missing:.+required by/.test(error.stderr)) {
          return {
            output: error.stdout,
            warning: `Results incomplete because of an error. This is most likely caused by peer dependencies. Try turning legacy-peer-deps off and resolve peer dependency conflicts. Original error:\n${error.stderr}`,
          };
        }
      }
      throw error;
    }
  })();

  // Remove the first line, as npm always prints the project root first
  const lines = output.split("\n").slice(1);

  const dependencyPaths = lines
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim());

  if (warning) {
    return { dependencyPaths, warning };
  }
  return { dependencyPaths };
}
