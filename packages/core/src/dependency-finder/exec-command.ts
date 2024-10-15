import { execSync } from "child_process";

export function execCommand(command: string, cwd: string): string {
  try {
    const output = execSync(command, {
      cwd,
      encoding: "utf-8",
    });

    return output;
  } catch (error) {
    throw new Error("Error executing command");
  }
}
