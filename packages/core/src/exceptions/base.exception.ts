export class BaseException extends Error {
  readonly originalError?: unknown;
  readonly errorCode: string;

  constructor(
    message: string,
    errorCode: string,
    context?: { originalError?: unknown },
  ) {
    super(message, {
      cause: {
        errorCode,
        ...(context ?? {}),
      },
    });
    this.errorCode = errorCode;
    this.originalError = context?.originalError;
  }
}
