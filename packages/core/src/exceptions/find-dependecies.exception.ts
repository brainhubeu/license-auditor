import { BaseException } from "./base.exception.js";

export const FIND_DEPENDENCIES_EXCEPTION = "FIND_DEPENDENCIES_EXCEPTION";

export class FindDependenciesException extends BaseException {
  constructor(message: string, context?: { originalError?: unknown }) {
    super(message, FIND_DEPENDENCIES_EXCEPTION, context);
  }
}
