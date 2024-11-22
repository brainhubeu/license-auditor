import { exec } from "node:child_process";

import { ExecCommandException } from '../exceptions/index.js';

export async function execCommand(
  command: string,
  cwd: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (stderr) {
        reject(
          new ExecCommandException(
            `Command "${command}" returned error.`,
            {
              originalError: error,
              stdout,
              stderr,
            }
          ),
        );
      }
      resolve(stdout);
    });
  });
}
