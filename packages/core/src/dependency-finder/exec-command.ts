import { exec } from "node:child_process";

import { ExecCommandException } from "../exceptions/index.js";

export async function execCommand(
  command: string,
  cwd: string,
  verbose?: boolean | undefined,
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error || (stderr && !stderr.includes("Debugger attached"))) {
        if (verbose) {
          console.error(error);
        }
        reject(
          new ExecCommandException(`Command "${command}" returned an error.`, {
            originalError: error,
            stdout,
            stderr,
          }),
        );
      }

      resolve(stdout);
    });
  });
}
