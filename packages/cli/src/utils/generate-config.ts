import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ConfigExtension } from "../constants/config-constants.js";

export enum ConfigType {
  Default = "default",
  Blank = "blank",
}

async function replaceExtension(
  currentDir: string,
  extension: ConfigExtension,
) {
  const jsFilePath = path.join(currentDir, "license-auditor.config.js");
  const newFilePath = path.join(
    currentDir,
    `license-auditor.config${extension}`,
  );

  try {
    await fs.rename(jsFilePath, newFilePath);
  } catch (error) {
    const message = `Failed to create the config file with the desired extension: ${extension}`;
    if (error instanceof Error) {
      throw new Error(`${message}, ${error.message}`);
    }
    throw new Error(message);
  }
}

export async function generateConfig(
  configType: ConfigType,
  extension: ConfigExtension,
) {
  try {
    const currentDir = process.env["ROOT_DIR"] ?? process.cwd();

    await fs.mkdir(currentDir, { recursive: true });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const templateDir = path.resolve(__dirname, `template/${configType}`);
    await fs.cp(templateDir, currentDir, { recursive: true });

    switch (extension) {
      case ConfigExtension.MJS:
        await replaceExtension(currentDir, extension);
        break;
      case ConfigExtension.TS:
        // todo
        break;
      case ConfigExtension.CJS:
        // todo
        break;
      case ConfigExtension.JSON:
        // todo
        break;
      default:
        break;
    }

    return `Configured license-auditor with ${configType} license whitelist and blacklist at: ${currentDir}/license-auditor.config${extension}`;
  } catch (err) {
    console.log(err);
    // todo: proper error handling
    // this is temporary and lacks actual guidance on how to resolve the issue
    throw new Error("Failed to complete license configuration");
  }
}
