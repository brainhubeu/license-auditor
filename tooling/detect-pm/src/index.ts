import { promises as fs } from "node:fs";
import { resolve } from "node:path";
import execa from "execa";

export type Pm = "npm" | "yarn" | "pnpm" | "bun";

/**
 * Check if a path exists
 */
async function pathExists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

const cache = new Map();

/**
 * Check if a global pm is available
 */
function hasGlobalInstallation(pm: Pm): Promise<boolean> {
  const key = `has_global_${pm}`;
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key));
  }

  return execa(pm, ["--version"])
    .then((res) => {
      return /^\d+.\d+.\d+$/.test(res.stdout);
    })
    .then((value) => {
      cache.set(key, value);
      return value;
    })
    .catch(() => false);
}

function getTypeofLockFile(cwd = "."): Promise<Pm | null> {
  const key = `lockfile_${cwd}`;
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key));
  }

  return Promise.all([
    pathExists(resolve(cwd, "yarn.lock")),
    pathExists(resolve(cwd, "package-lock.json")),
    pathExists(resolve(cwd, "pnpm-lock.yaml")),
    pathExists(resolve(cwd, "bun.lockb")),
  ]).then(([isYarn, isNpm, isPnpm, isBun]) => {
    let value: Pm | null = null;

    if (isYarn) {
      value = "yarn";
    } else if (isPnpm) {
      value = "pnpm";
    } else if (isBun) {
      value = "bun";
    } else if (isNpm) {
      value = "npm";
    }

    cache.set(key, value);
    return value;
  });
}

const detect = async ({
  cwd,
  includeGlobalBun,
}: { cwd?: string; includeGlobalBun?: boolean } = {}) => {
  const type = await getTypeofLockFile(cwd);
  if (type) {
    return type;
  }
  const [hasYarn, hasPnpm, hasBun] = await Promise.all([
    hasGlobalInstallation("yarn"),
    hasGlobalInstallation("pnpm"),
    includeGlobalBun && hasGlobalInstallation("bun"),
  ]);
  if (hasYarn) {
    return "yarn";
  }
  if (hasPnpm) {
    return "pnpm";
  }
  if (hasBun) {
    return "bun";
  }
  return "npm";
};

export { detect };

export function getNpmVersion(pm: Pm) {
  return execa(pm || "npm", ["--version"]).then((res) => res.stdout);
}

export function clearCache() {
  return cache.clear();
}
