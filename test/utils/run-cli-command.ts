import * as pty from "node-pty";

export type CliCommand = {
  command: string;
  args: string[];
  cwd?: string;
  env?: Record<string, string>;
};

export async function runCliCommand(
  command: CliCommand,
  options: { cols?: number } = {},
) {
  return new Promise<{ output: string; errorCode: number }>(
    (resolve, reject) => {
      try {
        const cli = pty.spawn(command.command, command.args, {
          cwd: command.cwd,
          env: command.env,
          ...(options.cols ? { cols: options.cols } : {}),
        });

        const output: string[] = [];
        cli.onData((data) => {
          output.push(data.toString());
        });

        cli.onExit((code) => {
          resolve({ output: output.join("\n"), errorCode: code.exitCode });
        });
      } catch (error) {
        reject(error);
      }
    },
  );
}
