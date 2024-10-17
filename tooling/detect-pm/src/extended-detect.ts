import { promises as fs } from "node:fs";
import path from "node:path";
import { type Pm, detect as originalDetect } from "./index";

export type SupportedPm = Omit<Pm, "bun" | "yarn"> | "yarn-classic";

async function readPackageJson(
  projectRoot: string,
): Promise<{ packageManager?: string } | undefined> {
  try {
    const packageJsonPath = path.join(projectRoot, "package.json");
    return JSON.parse(await fs.readFile(packageJsonPath, "utf-8")) as {
      packageManager?: string;
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error reading package.json: ${error.name} - ${error.message}`,
      );
    }
    throw new Error("Error reading package.json");
  }
}

async function isYarnModern(cwd: string): Promise<boolean> {
  const packageJson = await readPackageJson(cwd);
  return !!packageJson?.packageManager;
}

export async function detectPm({
  cwd,
  includeGlobalBun,
}: {
  cwd?: string;
  includeGlobalBun?: boolean;
} = {}): Promise<SupportedPm> {
  const originalResult = await originalDetect({ cwd, includeGlobalBun });

  if (originalResult === "bun") {
    throw new Error("Bun package manager is not yet supported");
  }

  if (originalResult === "yarn") {
    const isModern = await isYarnModern(cwd || ".");
    if (isModern) {
      // return "yarn-modern";
      throw new Error("Only yarn-classic versions are currently supported");
    }
    return "yarn-classic";
  }

  return originalResult;
}

// Re-export useful functions from the original module
export { clearCache } from "./index";
