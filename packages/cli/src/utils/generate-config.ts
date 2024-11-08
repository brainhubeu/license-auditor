import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ConfigExtension } from "../constants/config-constants.js";

export enum ConfigType {
  Default = "default",
  Blank = "blank",
}

async function copyConfigFile(
  currentDir: string,
  configType: ConfigType,
  extension: ConfigExtension
) {
  await fs.mkdir(currentDir, { recursive: true });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.resolve(
    __dirname,
    `../public/template/${configType}`
  );

  const templateFileName = `license-auditor.config${extension}`;
  const templatePath = path.join(templateDir, templateFileName);

  const destinationPath = path.join(currentDir, templateFileName);
  await fs.copyFile(templatePath, destinationPath);
}

export async function generateConfig(
  configType: ConfigType,
  extension: ConfigExtension
) {
  try {
    // biome-ignore lint/complexity/useLiteralKeys: literal key needed to access ROOT_DIR env
    const currentDir = process.env["ROOT_DIR"] ?? process.cwd();

    await copyConfigFile(currentDir, configType, extension);

    return `Configured license-auditor with ${configType} license whitelist and blacklist at: ${currentDir}/license-auditor.config${extension}`;
  } catch (err) {
    console.log(err);
    // todo: proper error handling
    // this is temporary and lacks actual guidance on how to resolve the issue
    throw new Error("Failed to complete license configuration");
  }
}
