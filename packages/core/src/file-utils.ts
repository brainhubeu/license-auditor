import * as fs from "node:fs";
import * as path from "node:path";

export function readPackageJson(packagePath: string) {
  const packageJsonPath = path.join(packagePath, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    return JSON.parse(packageJsonContent);
  }
  console.warn(`package.json not found for package at ${packageJsonPath}`);
}

export function extractPackageName(packagePath: string) {
  return path.basename(packagePath);
}
