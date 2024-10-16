import { execSync } from "node:child_process";

export function execCommand(command: string, cwd: string): string {
  try {
    const output = execSync(command, {
      cwd,
      encoding: "utf-8",
    });

    return output;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error executing command ${command}: ${error.name} - ${error.message}`,
      );
    }
    throw new Error(`Error executing command ${command}`);
  }
}
