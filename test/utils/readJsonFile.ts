import * as fs from 'node:fs/promises';

export async function readJsonFile(filePath: string) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}
