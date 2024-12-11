import * as fs from "node:fs/promises";

import path from "node:path";
import { getInstallCommand } from "../global-setup";
import { type Details, type LicenseFile, addPackage } from "./add-package";
import { execAsync } from "./exec-async";

export const addYarnPackage = async (
  testDirectory: string,
  depName: string,
  packageDetails: Details,
  licenseFiles?: LicenseFile[],
) => {
  const packageJsonPath = path.join(testDirectory, "package.json");

  const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
  const parsedPackageJson = JSON.parse(packageJsonContent);

  const addedPackage = {
    ...parsedPackageJson,
    dependencies: {
      ...parsedPackageJson.dependencies,
      [depName]: packageDetails.version,
    },
  };

  await fs.writeFile(
    path.join(testDirectory, "package.json"),
    JSON.stringify(addedPackage, null, 2),
  );

  const installCommand = await getInstallCommand(testDirectory);
  await execAsync(installCommand, { cwd: testDirectory });

  await addPackage(testDirectory, depName, packageDetails, licenseFiles);
};
