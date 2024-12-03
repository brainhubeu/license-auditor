import parse, { type Info } from "spdx-expression-parse";

export function parseLicenseLogicalExpression(
  licenseExpression: unknown,
): Info | undefined {
  if (typeof licenseExpression === "string") {
    try {
      return parse(licenseExpression);
    } catch (error) {
      // Most common error when spdx-expression-parse fails to parse the license expression.
      // The error message thrown is not very useful, hence we silence it.
      if (!(error instanceof Error && error.message.startsWith("Unexpected"))) {
        console.error(error);
      }
      return undefined;
    }
  }
  return undefined;
}
