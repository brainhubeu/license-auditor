import * as fs from "node:fs/promises";

import path from "node:path";
import { getInstallCommand } from "../global-setup";
import { type Details, type LicenseFile, addPackage } from "./add-package";
import { execAsync } from "./exec-async";

export const addToPackageJson = async (
  testDirectory: string,
  depName: string,
  packageDetails: Details,
  licenseFiles?: LicenseFile[],
  devDependency?: boolean,
) => {
  const packageJsonPath = path.join(testDirectory, "package.json");

  const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
  const packageJson = JSON.parse(packageJsonContent);
  const targetField = devDependency ? "devDependencies" : "dependencies";

  if (!packageJson[targetField]) {
    packageJson[targetField] = {};
  }

  packageJson[targetField][depName] = packageDetails.version;

  await fs.writeFile(
    path.join(testDirectory, "package.json"),
    JSON.stringify(packageJson, null, 2),
  );

  const installCommand = await getInstallCommand(testDirectory);
  try {
    await execAsync(installCommand, { cwd: testDirectory });
  } catch (err) {
    console.log("ERROR: ", err);
  }

  await addPackage(testDirectory, depName, packageDetails, licenseFiles);
};
