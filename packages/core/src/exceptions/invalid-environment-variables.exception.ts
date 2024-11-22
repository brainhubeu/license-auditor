import { BaseException } from "./base.exception.js";

export const INVALID_ENVIRONMENT_VARIABLES_EXCEPTION =
  "INVALID_ENVIRONMENT_VARIABLES_EXCEPTION";

export class InvalidEnvironmentVariablesException extends BaseException {
  constructor(message: string, context?: { originalError?: unknown }) {
    super(message, INVALID_ENVIRONMENT_VARIABLES_EXCEPTION, context);
  }
}
