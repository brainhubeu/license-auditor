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
  await fs.rename(jsFilePath, newFilePath);
}

async function copyConfigFile(
  currentDir: string,
  configType: ConfigType,
  extension: ConfigExtension,
) {
  await fs.mkdir(currentDir, { recursive: true });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.resolve(__dirname, `template/${configType}`);
  const templateFileName = `license-auditor.config${extension}`;
  const templatePath = path.join(templateDir, templateFileName);

  const destinationPath = path.join(currentDir, templateFileName);
  await fs.copyFile(templatePath, destinationPath);
}

export async function generateConfig(
  configType: ConfigType,
  extension: ConfigExtension,
) {
  try {
    const currentDir = process.env["ROOT_DIR"] ?? process.cwd();

    await copyConfigFile(currentDir, configType, extension);

    // mjs and js vary only in the file extension
    if (extension === ConfigExtension.CJS) {
      await replaceExtension(currentDir, extension);
    }

    return `Configured license-auditor with ${configType} license whitelist and blacklist at: ${currentDir}/license-auditor.config${extension}`;
  } catch (err) {
    console.log(err);
    // todo: proper error handling
    // this is temporary and lacks actual guidance on how to resolve the issue
    throw new Error("Failed to complete license configuration");
  }
}
