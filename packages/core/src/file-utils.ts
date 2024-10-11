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

// done this way to avoid reading package.json when checking for an existing value in Map
// if it proves unreliable reading package.json will be inevitable
export function extractPackageName(packagePath: string) {
  const baseName = path.basename(packagePath);
  const parentName = path.basename(path.dirname(packagePath));

  if (parentName.startsWith("@")) {
    return `${parentName}/${baseName}`;
  }
  return baseName;
}
