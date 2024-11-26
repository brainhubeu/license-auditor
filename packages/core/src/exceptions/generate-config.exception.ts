import { BaseException } from "./base.exception.js";

export const GENERATE_CONFIG_EXCEPTION = "GENERATE_CONFIG_EXCEPTION";

export class GenerateConfigException extends BaseException {
  constructor(message: string, context?: { originalError?: unknown }) {
    super(message, GENERATE_CONFIG_EXCEPTION, context);
  }
}
