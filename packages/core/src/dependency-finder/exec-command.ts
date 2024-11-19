import { exec } from "node:child_process";
import { CommandExecutionError } from "../errors.js";

export async function execCommand(
  command: string,
  cwd: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (_, stdout, stderr) => {
      if (stderr) {
        reject(
          new CommandExecutionError(
            `Command "${command}" returned error.`,
            stdout,
            stderr,
          ),
        );
      }
      resolve(stdout);
    });
  });
}
