import { BaseException } from "./base.exception.js";

export const EXEC_COMMAND_EXCEPTION = "EXEC_COMMAND_EXCEPTION";

export class ExecCommandException extends BaseException {
  constructor(message: string, context?: { originalError?: unknown }) {
    super(message, EXEC_COMMAND_EXCEPTION, context);
  }
}
