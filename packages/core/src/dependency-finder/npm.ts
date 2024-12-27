import type { DependenciesResult } from "@license-auditor/data";
import Arborist, { type Node } from "@npmcli/arborist";

const flattenDependenciesTree = (
  tree: Node,
  production?: boolean,
): string[] => {
  const dependencies: string[] = [];
  for (const [, node] of tree.children) {
    if (!(production && node.dev)) {
      const packagePath = node.path;
      if (!packagePath) {
        throw new Error("Package found by arborist is missing a path");
      }
      dependencies.push(packagePath);
    }
    dependencies.push(...flattenDependenciesTree(node, production));
  }

  return dependencies;
};

export async function findNpmDependencies(
  projectRoot: string,
  production?: boolean | undefined,
): Promise<DependenciesResult> {
  try {
    const arborist = new Arborist({ path: projectRoot });
    const tree = await arborist.loadActual();

    const dependencies: string[] = flattenDependenciesTree(tree, production);

    return { dependencies };
  } catch (error) {
    console.log("arborist error", error);
    throw error;
  }
}
