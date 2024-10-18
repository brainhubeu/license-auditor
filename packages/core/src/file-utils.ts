import * as fs from "node:fs";
import * as path from "node:path";
import z, { type SafeParseReturnType } from "zod";

const packageJsonSchema = z
  .object({
    license: z.string().optional(),
    licenses: z.array(z.string()).optional(),
  })
  .refine(
    (data) => !!data.license || !!data.licenses,
    "Either license or licenses has to be defined for a valid package.json",
  );

export function readPackageJson(packagePath: string): object {
  const packageJsonPath = path.join(packagePath, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    const parsedPackageJson = JSON.parse(packageJsonContent);
    if (!!parsedPackageJson && typeof parsedPackageJson === "object") {
      return parsedPackageJson;
    }
  }
  // unsure how often such case happens and whether the license verification should be skipped
  throw new Error(`package.json not found for package at ${packagePath}`);
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

export function validatePackageJson(packageJson: object): boolean {
  const result = packageJsonSchema.safeParse(packageJson);

  return result.success;
}
