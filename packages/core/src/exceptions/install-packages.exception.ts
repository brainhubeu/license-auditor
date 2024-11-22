import { BaseException } from "./base.exception.js";

export const INSTALL_PACKAGES_EXCEPTION = "INSTALL_PACKAGES_EXCEPTION";

export class InstallPackagesException extends BaseException {
  constructor(message: string, context?: { originalError?: unknown }) {
    super(message, INSTALL_PACKAGES_EXCEPTION, context);
  }
}
