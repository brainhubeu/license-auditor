import * as fs from "node:fs/promises";
import * as path from "node:path";
import { z } from "zod";

const DependecySchema = z
  .object({
    version: z.string(),
    resolved: z.string().optional(),
    integrity: z.string().optional(),
    license: z.string().optional(),
    dependencies: z.record(z.string(), z.string()).optional(),
    engines: z.record(z.string(), z.string()).optional(),
    funding: z
      .union([
        z.string(),
        z.record(z.string(), z.string()),
        z.array(z.record(z.string(), z.string())),
      ])
      .optional(),
    peerDependenciesMeta: z
      .record(z.string(), z.record(z.string(), z.boolean()))
      .optional(),
  })
  .strict();

const RootDependencySchema = z
  .object({
    name: z.string(),
    version: z.string(),
    dependencies: z.record(z.string(), z.string()).optional(),
  })
  .strict();

const PackageLockSchema = z
  .object({
    name: z.string().optional(),
    version: z.string(),
    lockfileVersion: z.number(),
    requires: z.boolean(),
    packages: z.record(
      z.string(),
      z.union([DependecySchema, RootDependencySchema]),
    ),
  })
  .strict();

type PackageLock = z.infer<typeof PackageLockSchema>;

const PackageSchema = z
  .object({
    name: z.string(),
    version: z.string(),
    main: z.string(),
    scripts: z.object({
      run: z.string(),
    }),
    private: z.boolean(),
    dependencies: z.record(z.string(), z.string()),
    license: z.string().optional(),
  })
  .strict();

type Package = z.infer<typeof PackageSchema>;

type Details = {
  version: string;
  license: string;
  dependencies?: Record<string, string>;
};

const appendPackageLock = async (
  testDirectory: string,
  depName: string,
  packageDetails: Details,
) => {
  const filePath = path.resolve(testDirectory, "package-lock.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const parsedContent: PackageLock = JSON.parse(fileContent);
  const validatedPackageLock = PackageLockSchema.parse(parsedContent);

  const packages = validatedPackageLock.packages || {};
  packages[depName] = packageDetails;

  validatedPackageLock.packages = packages;

  await fs.writeFile(
    filePath,
    JSON.stringify(validatedPackageLock, null, 2),
    "utf-8",
  );
};

const defaultPackageJson: Pick<Package, "main" | "scripts" | "private"> = {
  main: "index.js",
  scripts: { run: 'echo "Nope"' },
  private: true,
};

const addPackageDirectoryToNodeModules = async (
  testDirectory: string,
  depName: string,
  packageDetails: Details,
) => {
  const packageJson: Package = {
    ...defaultPackageJson,
    name: depName,
    version: packageDetails.version,
    dependencies: packageDetails.dependencies || {},
    license: packageDetails.license,
  };
  const packageDirectory = path.resolve(testDirectory, depName);
  await fs.mkdir(packageDirectory, { recursive: true });

  const packageJsonPath = path.resolve(packageDirectory, "package.json");
  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    "utf-8",
  );
};

export const addPackage = async (
  testDirectory: string,
  depName: string,
  packageDetails: Details,
): Promise<void> => {
  await appendPackageLock(testDirectory, depName, packageDetails);
  await addPackageDirectoryToNodeModules(
    testDirectory,
    depName,
    packageDetails,
  );
};
