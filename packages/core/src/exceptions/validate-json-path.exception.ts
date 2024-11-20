import { BaseException } from "./base.exception.js";

export const VALIDATE_JSON_PATH_EXCEPTION = "VALIDATE_JSON_PATH_EXCEPTION";

export class ValidateJsonPathException extends BaseException {
  constructor(message: string, context?: { originalError?: unknown }) {
    super(message, VALIDATE_JSON_PATH_EXCEPTION, context);
  }
}
