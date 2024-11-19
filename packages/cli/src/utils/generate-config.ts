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

type GenerateConfigError = {
  error: { message: string };
  success: false;
};

type GenerateConfigSuccess = {
  success: true;
};

type GenerateConfigResult = GenerateConfigSuccess | GenerateConfigError;

export async function generateConfig(
  configListType: ConfigListType,
  extension: ConfigExtension,
  dir: string,
): Promise<GenerateConfigResult> {
  try {
    await copyConfigFile(dir, configListType, extension);
    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: { message: error.message },
      };
    }
    return {
      success: false,
      error: { message: "Unknown error" },
    };
  }
}
