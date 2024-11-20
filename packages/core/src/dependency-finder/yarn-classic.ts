import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { execCommand } from "./exec-command.js";

const YarnDependencySchema = z.object({
  name: z.string(),
  children: z.array(z.any()).length(0),
  hint: z.string().nullable(),
  color: z.string().nullable(),
  depth: z.literal(0),
});

const YarnListOutputSchema = z.object({
  type: z.literal("tree"),
  data: z.object({
    type: z.literal("list"),
    trees: z.array(YarnDependencySchema),
  }),
});

type YarnDependency = z.infer<typeof YarnDependencySchema>;

export const findYarnClassicDepsCommand = "yarn list --depth=0 --json -R";
export const findYarnClassicProdDepsCommand =
  "yarn list --depth=0 --json -R --prod";

export async function findYarnClassicDependencies(
  projectRoot: string,
  production?: boolean | undefined,
): Promise<string[]> {
  const output = await execCommand(
    production ? findYarnClassicProdDepsCommand : findYarnClassicDepsCommand,
    projectRoot,
  );
  const dependenciesList = JSON.parse(output);

  const validationResult = YarnListOutputSchema.safeParse(dependenciesList);
  if (!validationResult.success) {
    throw new Error("Invalid yarn list --depth=0 --json -R output");
  }

  return await extractDependencyPaths(
    validationResult.data.data.trees,
    projectRoot,
  );
}

async function extractDependencyPaths(
  dependencies: YarnDependency[],
  projectRoot: string,
): Promise<string[]> {
  const dependencyPromises = dependencies.map((dep) => {
    const packageName = dep.name.split("@").slice(0, -1).join("@");
    const dependencyPath = path.join(projectRoot, "node_modules", packageName);
    return fs
      .access(dependencyPath)
      .then(() => dependencyPath)
      .catch(() => null);
  });

  const dependencyPaths = await Promise.all(dependencyPromises);
  return dependencyPaths.filter((path): path is string => path !== null);
}
