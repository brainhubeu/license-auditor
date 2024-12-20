import { LICENSE_SOURCE, type LicenseWithSource } from "@license-auditor/data";
import type { Info } from "spdx-expression-parse";
import { findLicenseById } from "./find-license-by-id.js";

export function extractLicensesFromExpression(
  licenseExpressionParsed: Info,
): LicenseWithSource[] {
  const licenses = new Set<LicenseWithSource>();

  function traverse(node: Info): void {
    if ("license" in node) {
      const [license] = findLicenseById(node.license);
      if (license) {
        licenses.add({
          ...license,
          source: LICENSE_SOURCE.packageJsonLicensesExpression,
        });
        return;
      }
      console.error(
        "Failed to find license:",
        node.license,
        "in expression:",
        licenseExpressionParsed,
      );
    }
    if ("conjunction" in node && "left" in node && "right" in node) {
      traverse(node.left);
      traverse(node.right);
    }
  }

  traverse(licenseExpressionParsed);
  return Array.from(licenses);
}
