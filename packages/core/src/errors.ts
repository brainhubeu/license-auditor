export class CommandExecutionError extends Error {
  constructor(
    message: string,
    public stdout: string,
    public stderr: string,
  ) {
    super(message);
  }
}
