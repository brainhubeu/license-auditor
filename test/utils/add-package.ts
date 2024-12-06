import * as fs from "node:fs/promises";
import * as path from "node:path";
import { z } from "zod";

type LicenseFile = {
  name: string;
  content: string;
};

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
  license?: string;
  dependencies?: Record<string, string>;
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
  licenseFiles?: LicenseFile[],
) => {
  const packageJson: Package = {
    ...defaultPackageJson,
    name: depName,
    version: packageDetails.version,
    dependencies: packageDetails.dependencies || {},
    license: packageDetails.license,
  };
  const packageDirectory = path.resolve(testDirectory, 'node_modules', depName);
  await fs.mkdir(packageDirectory, { recursive: true });

  const packageJsonPath = path.resolve(packageDirectory, "package.json");
  await fs.writeFile(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    "utf-8",
  );

  if (licenseFiles) {
    for (const { name, content } of licenseFiles) {
      const licenseFilePath = path.resolve(packageDirectory, name);
      await fs.writeFile(licenseFilePath, content, "utf-8");
    }
  }
};

export const addPackage = async (
  testDirectory: string,
  depName: string,
  packageDetails: Details,
  licenseFiles?: LicenseFile[],
): Promise<void> => {
  await addPackageDirectoryToNodeModules(
    testDirectory,
    depName,
    packageDetails,
    licenseFiles,
  );
};
