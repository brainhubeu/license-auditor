import parse, { type Info } from "spdx-expression-parse";

export function parseLicenseLogicalExpression(
  licenseExpression: unknown,
): Info | undefined {
  if (typeof licenseExpression === "string") {
    try {
      return parse(licenseExpression);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  return undefined;
}
