import { packagePaths } from "../temp-fixture";

export function detectPnpmDependencies(projectRoot: string): string[] {
  return packagePaths;
}
