import fs from "node:fs/promises";
import path from "node:path";
import type { DependenciesResult } from "@license-auditor/data";
import flattenDeep from "lodash.flattendeep";
import { z } from "zod";
import { FindDependenciesException } from "../exceptions/find-dependecies.exception.js";
import { execCommand } from "./exec-command.js";

const YarnDependencySchema = z.object({
  name: z.string(),
  children: z.array(z.any()),
  hint: z.string().nullable(),
  color: z.string().nullable(),
});

const YarnListOutputSchema = z.object({
  type: z.literal("tree"),
  data: z.object({
    type: z.literal("list"),
    trees: z.array(YarnDependencySchema),
  }),
});

type YarnDependency = z.infer<typeof YarnDependencySchema>;

export const findYarnClassicDepsCommand = "yarn list --json -R";
export const findYarnClassicProdDepsCommand = "yarn list --json -R --prod";

export async function findYarnClassicDependencies(
  projectRoot: string,
  production?: boolean | undefined,
  verbose?: boolean | undefined,
): Promise<DependenciesResult> {
  const output = await execCommand(
    production ? findYarnClassicProdDepsCommand : findYarnClassicDepsCommand,
    projectRoot,
    verbose,
  );
  const dependenciesList = JSON.parse(output);

  const validationResult = YarnListOutputSchema.safeParse(dependenciesList);

  if (!validationResult.success) {
    throw new FindDependenciesException("Invalid yarn list -R output", {
      originalError: validationResult.error,
    });
  }

  const dependencies = flattenDeep(validationResult.data.data.trees);

  const dependencyPaths = await extractDependencyPaths(
    dependencies,
    projectRoot,
  );

  return { dependencies: dependencyPaths };
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
