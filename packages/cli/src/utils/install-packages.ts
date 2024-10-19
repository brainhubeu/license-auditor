import { exec } from "node:child_process";
import { promisify } from "node:util";
import {
  type SupportedPm,
  findPackageManager,
} from "@license-auditor/package-manager-finder";

const execAsync = promisify(exec);

const packagesToInstall = [
  "@brainhubeu/license-auditor-cli",
  "@brainhubeu/license-auditor-core",
] as const;

export async function installPackages() {
  try {
    const currentDir = process.cwd();

    const packageManager = await findPackageManager(currentDir);

    const installCommand = getInstallCommand(packageManager);
    console.log(`Installing packages using ${packageManager}...`);

    await execAsync(`${installCommand} ${packagesToInstall.join(" ")}`, {
      cwd: currentDir,
    });

    console.log("Packages installed successfully.");
  } catch (err) {
    // todo: proper error handling and guidance on what to do
    console.error(err);
    throw new Error("Failed to install dependencies");
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
      throw new Error(`Unsupported package manager: ${packageManager}`);
  }
}
