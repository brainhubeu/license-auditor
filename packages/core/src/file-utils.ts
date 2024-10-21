import * as fs from "node:fs";
import * as path from "node:path";
import { type PackageJsonType, packageJsonSchema } from "./schemas";

interface PackageJsonResult {
  packageJson?: PackageJsonType;
  errorMessage?: string;
}

export function readPackageJson(packagePath: string): PackageJsonResult {
  const packageJsonPath = path.join(packagePath, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    const parsedPackageJson = JSON.parse(packageJsonContent);

    const validationResult = packageJsonSchema.safeParse(parsedPackageJson);

    if (validationResult.error) {
      console.warn(`Failed validation of package.json at ${packageJsonPath}`);
      console.warn(validationResult.error.message);
      return { errorMessage: validationResult.error.message };
    }

    if (validationResult.success) {
      return { packageJson: validationResult.data };
    }
  }
  // unsure how often such case happens and whether the license verification should be skipped
  const errorMsg = `package.json not found for package at ${packagePath}`;
  console.warn(errorMsg);
  return { errorMessage: errorMsg };
}

// done this way to avoid reading package.json when checking for an existing value in Map
// if it proves unreliable reading package.json will be inevitable
export function extractPackageName(packagePath: string): string {
  const baseName = path.basename(packagePath);
  const parentName = path.basename(path.dirname(packagePath));

  if (parentName.startsWith("@")) {
    return `${parentName}/${baseName}`;
  }
  return baseName;
}
