import type { DependenciesResult } from "@license-auditor/data";
import { ExecCommandException } from "../exceptions/index.js";
import { execCommand } from "./exec-command.js";

export const findNpmDepsCommand = "npm ls --all -p";
export const findNpmProdDepsCommand = "npm ls --all -p --omit=dev";

export async function findNpmDependencies(
  projectRoot: string,
  production?: boolean | undefined,
  verbose?: boolean | undefined,
): Promise<DependenciesResult> {
  const { output, warning } = await (async () => {
    try {
      return {
        output: await execCommand(
          production ? findNpmProdDepsCommand : findNpmDepsCommand,
          projectRoot,
          verbose,
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
        if (/ELSPROBLEMS/.test(error.stderr)) {
          throw new ExecCommandException(
            [
              "",
              "Unable to resolve project dependencies.",
              error.message,
              "",
              "Potential causes:",
              "  - Incompatible or inconsistent version specifications in package.json.",
              "  - Conflicts in peer dependencies.",
              "  - Cached or outdated data in node_modules or npm cache.",
              "",
              "Suggested actions:",
              "  1. Inspect and resolve version conflicts in package.json.",
              "  2. Check and address peer dependency conflicts.",
              "  3. Clear the node_modules folder and reinstall dependencies with a clean state:",
              "       remove node_modules and run npm install",
              "  4. Clear the npm cache to ensure no outdated or corrupted data is used:",
              "       npm cache clean --force",
            ].join("\n"),
            {
              stdout: error.stdout,
              stderr: error.stderr,
              originalError: error.originalError,
            },
          );
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
