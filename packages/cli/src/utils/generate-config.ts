import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ConfigExtension } from "../constants/config-constants.js";

export enum ConfigType {
  Default = "default",
  Blank = "blank",
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

    return `Configured license-auditor with ${configType} license whitelist and blacklist at: ${currentDir}/license-auditor.config${extension}`;
  } catch (err) {
    console.log(err);
    // todo: proper error handling
    // this is temporary and lacks actual guidance on how to resolve the issue
    throw new Error("Failed to complete license configuration");
  }
}
