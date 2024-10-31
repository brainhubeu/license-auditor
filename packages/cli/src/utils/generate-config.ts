import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ConfigExtension } from "../constants/config-constants.js";

export enum ConfigListType {
  Default = "default",
  Blank = "blank",
}

async function copyConfigFile(
  currentDir: string,
  configListType: ConfigListType,
  extension: ConfigExtension,
) {
  await fs.mkdir(currentDir, { recursive: true });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.resolve(__dirname, `template/${configListType}`);
  const templateFileName = `license-auditor.config${extension}`;
  const templatePath = path.join(templateDir, templateFileName);

  const destinationPath = path.join(currentDir, templateFileName);
  await fs.copyFile(templatePath, destinationPath);
}

export async function generateConfig(
  configListType: ConfigListType,
  extension: ConfigExtension,
  dir: string,
) {
  try {
    await copyConfigFile(dir, configListType, extension);

    return `Configured license-auditor with ${configListType} license whitelist and blacklist at: ${dir}/license-auditor.config${extension}`;
  } catch (err) {
    console.log(err);
    // todo: proper error handling
    // this is temporary and lacks actual guidance on how to resolve the issue
    throw new Error("Failed to complete license configuration");
  }
}
