import * as fs from "node:fs";
import * as path from "node:path";
import { z } from "zod";

type PackageJsonResult =
  | { success: true; packageJson: PackageJsonType }
  | { success: false; errorMessage: string };

export const packageJsonSchema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),
  license: z.string().optional(),
  licenses: z.array(z.string()).optional(),
});

export type PackageJsonType = z.infer<typeof packageJsonSchema>;

export function readPackageJson(packagePath: string): PackageJsonResult {
  const packageJsonPath = path.join(packagePath, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    const parsedPackageJson = JSON.parse(packageJsonContent);

    const validationResult = packageJsonSchema.safeParse(parsedPackageJson);

    if (validationResult.error) {
      console.warn(`Failed validation of package.json at ${packageJsonPath}`);
      console.warn(validationResult.error.message);
      return { errorMessage: validationResult.error.message, success: false };
    }

    if (validationResult.success) {
      return { packageJson: validationResult.data, success: true };
    }
  }
  // unsure how often such case happens and whether the license verification should be skipped
  const errorMsg = `package.json not found for package at ${packagePath}`;
  console.warn(errorMsg);
  return { errorMessage: errorMsg, success: false };
}

// reading package.json turned out to be inevitable since we want to include version in the key
export function extractPackageName(packagePath: string): string {
  const packageResult = readPackageJson(packagePath);

  if (packageResult.success) {
    const { packageJson } = packageResult;

    if (packageJson?.name && packageJson.version) {
      return `${packageJson.name}@${packageJson.version}`;
    }
  }

  const baseName = path.basename(packagePath);
  const parentName = path.basename(path.dirname(packagePath));

  if (parentName.startsWith("@")) {
    return `${parentName}/${baseName}`;
  }
  return baseName;
}
