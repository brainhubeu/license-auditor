import type { DependenciesResult } from "@license-auditor/data";
import { ExecCommandException } from "../exceptions/index.js";
import { execCommand } from "./exec-command.js";

export const findNpmDepsCommand = "npm ls --all -p";
export const findNpmProdDepsCommand = "npm ls --all -p --omit=dev";

export async function findNpmDependencies(
  projectRoot: string,
  production?: boolean | undefined,
): Promise<DependenciesResult> {
  const { output, warning } = await (async () => {
    try {
      return {
        output: await execCommand(
          production ? findNpmProdDepsCommand : findNpmDepsCommand,
          projectRoot,
        ),
      };
    } catch (error) {
      if (error instanceof ExecCommandException) {
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

  const dependencies = lines
    .filter((line) => line.trim() !== "")
    .map((line) => line.trim());

  if (warning) {
    return { dependencies, warning };
  }
  return { dependencies };
}
