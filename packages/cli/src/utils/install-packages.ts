import { exec } from "node:child_process";
import { promisify } from "node:util";
import {
  InstallPackagesException,
  type SupportedPm,
  UnsupportedPackageManagerException,
  findPackageManager,
} from "@brainhubeu/license-auditor-core";

const execAsync = promisify(exec);

const packagesToInstall = ["@brainhubeu/license-auditor-cli@alpha"] as const;

export async function installPackages(dir: string) {
  try {
    const packageManager = await findPackageManager(dir);

    const installCommand = getInstallCommand(packageManager);

    await execAsync(`${installCommand} ${packagesToInstall.join(" ")}`, {
      cwd: dir,
    });
  } catch (err) {
    throw new InstallPackagesException("Failed to install dependencies", {
      originalError: err,
    });
  }
}

function getInstallCommand(packageManager: SupportedPm): string {
  switch (packageManager) {
    case "npm":
      return "npm install --save-dev";
    case "pnpm":
      return "pnpm add -D";
    case "yarn-classic":
      return "yarn add --dev";
    default:
      throw new UnsupportedPackageManagerException(
        `Unsupported package manager: ${packageManager}`,
      );
  }
}
