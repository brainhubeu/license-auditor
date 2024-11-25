import { BaseException } from "./base.exception.js";

export const EXEC_COMMAND_EXCEPTION = "EXEC_COMMAND_EXCEPTION";

export class ExecCommandException extends BaseException {
  readonly stdout: string;
  readonly stderr: string;

  constructor(
    message: string,
    context: { originalError?: unknown; stdout: string; stderr: string },
  ) {
    super(message, EXEC_COMMAND_EXCEPTION, context);
    this.stdout = context.stdout;
    this.stderr = context.stderr;
  }
}
