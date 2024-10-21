import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function execCommand(
  command: string,
  cwd: string,
): Promise<string> {
  try {
    const { stdout } = await execAsync(command, { cwd });
    return stdout;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Error executing command ${command}: ${error.name} - ${error.message}`,
      );
    }
    throw new Error(`Error executing command ${command}`);
  }
}
