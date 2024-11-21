import { z } from "zod";
import { execCommand } from "./exec-command.js";

const PnpmDependencySchema = z.object({
  from: z.string(),
  version: z.string(),
  resolved: z.string().optional(),
  path: z.string(),
});

const PnpmListDependenciesOutputSchema = z
  .object({
    dependencies: z.record(z.string(), PnpmDependencySchema).optional(),
    devDependencies: z.record(z.string(), PnpmDependencySchema).optional(),
  })
  .and(z.record(z.string(), z.unknown()));

type PnpmDependency = z.infer<typeof PnpmDependencySchema>;

export const findPnpmDepsCommand = "pnpm ls --json";
export const findPnpmProdDepsCommand = "pnpm ls --json --prod";

export async function findPnpmDependencies(
  projectRoot: string,
  production?: boolean | undefined,
): Promise<string[]> {
  const output = await execCommand(
    production ? findPnpmProdDepsCommand : findPnpmDepsCommand,
    projectRoot,
  );
  const parsedOutput = JSON.parse(output);

  const validationResult = z
    .array(PnpmListDependenciesOutputSchema)
    .safeParse(parsedOutput);
  if (!validationResult.success) {
    throw new Error("Invalid pnpm ls --json output format");
  }

  const pnpmOutput = validationResult.data[0];
  if (!pnpmOutput) {
    throw new Error("No pnpm output data found");
  }

  const dependenciesPaths: string[] = [];

  const dependencies = pnpmOutput.dependencies ?? {};
  const devDependencies = pnpmOutput.devDependencies ?? {};

  dependenciesPaths.push(...extractDependencyPaths(dependencies));
  dependenciesPaths.push(...extractDependencyPaths(devDependencies));

  return dependenciesPaths;
}

const extractDependencyPaths = (
  dependencies: Record<string, PnpmDependency>,
): string[] => Object.values(dependencies).map((dep) => dep.path);
