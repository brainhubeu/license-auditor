import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ConfigType } from "@license-auditor/data";

export async function readDefaultConfig(): Promise<{
  config: ConfigType;
  templateDir: string;
}> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = path.resolve(
    __dirname,
    "template/default/.license-auditorrc.json",
  );

  const content = await fs.readFile(templateDir, "utf-8");

  const config: ConfigType = JSON.parse(content);

  return { config, templateDir };
}
