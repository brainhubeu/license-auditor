import { BaseException } from "./base.exception.js";

export const UNSUPPORTED_PACKAGE_MANAGER_EXCEPTION =
  "UNSUPPORTED_PACKAGE_MANAGER_EXCEPTION";

export class UnsupportedPackageManagerException extends BaseException {
  constructor(message: string, context?: { originalError?: unknown }) {
    super(message, UNSUPPORTED_PACKAGE_MANAGER_EXCEPTION, context);
  }
}
