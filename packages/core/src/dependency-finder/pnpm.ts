import { z } from "zod";
import { execCommand } from "./exec-command";

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

export async function detectPnpmDependencies(
  projectRoot: string,
): Promise<string[]> {
  const output = await execCommand("pnpm ls --json", projectRoot);
  const parsedOutput = JSON.parse(output);

  const validationResult = z
    .array(PnpmListDependenciesOutputSchema)
    .safeParse(parsedOutput);
  if (!validationResult.success) {
    throw new Error("Invalid pnpm ls --json output format");
  }

  const dependenciesList = validationResult.data;
  const dependencyPaths: string[] = [];

  if (dependenciesList.length > 0) {
    if (dependenciesList[0]?.dependencies) {
      const paths = extractDependencyPaths(dependenciesList[0].dependencies);
      dependencyPaths.push(...paths);
    }

    if (dependenciesList[0]?.devDependencies) {
      const paths = extractDependencyPaths(dependenciesList[0].devDependencies);
      dependencyPaths.push(...paths);
    }
  }

  return dependencyPaths;
}

const extractDependencyPaths = (
  dependencies: Record<string, PnpmDependency>,
): string[] => Object.values(dependencies).map((dep) => dep.path);
