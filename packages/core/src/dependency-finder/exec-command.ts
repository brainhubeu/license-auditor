import { exec } from "node:child_process";

import { ExecCommandException } from "../exceptions/index.js";

type ExecCommandResult = {
  stdout: string;
  stderr: string;
};

export async function execCommand(
  command: string,
  cwd: string,
  verbose?: boolean | undefined,
): Promise<ExecCommandResult> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(
          new ExecCommandException(
            error?.stack && verbose
              ? `\n${error.stack}\n\n${stdout}`
              : `Command "${command}" returned an error.`,
            {
              originalError: error,
              stdout,
              stderr,
            },
          ),
        );
      }

      resolve({ stdout, stderr });
    });
  });
}
