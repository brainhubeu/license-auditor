import type { DependenciesResult } from "@license-auditor/data";
import { execCommand } from "./exec-command.js";

export const findPnpmDepsCommand = "pnpm ls -r --parseable --depth=Infinity";
export const findPnpmProdDepsCommand = "pnpm ls -r -P --parseable --depth=Infinity";

export async function findPnpmDependencies(
  projectRoot: string,
  production?: boolean | undefined,
): Promise<DependenciesResult> {
  const output = await execCommand(
    production ? findPnpmProdDepsCommand : findPnpmDepsCommand,
    projectRoot,
  );

  const [_, ...dependencies] = output.split("\n");

  return { dependencies: dependencies.filter(dependency => dependency !== '') };
}

