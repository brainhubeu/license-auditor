import type { ConfigType, LicenseStatus } from "@license-auditor/data";
import type { Info } from "spdx-expression-parse";
import { findLicenseById } from "./license-finder/find-license-by-id.js";
import { checkLicenseStatus } from "./check-license-status.js";

export function evaluateLicenseExpression(
  parsedLicenseExpression: Info,
  config: ConfigType,
): LicenseStatus {
  if ("license" in parsedLicenseExpression) {
    const license = findLicenseById(parsedLicenseExpression.license)?.at(0);
    if (license) {
      return checkLicenseStatus(license, config);
    }
    return "unknown";
  }
  if ("conjunction" in parsedLicenseExpression) {
    const leftStatus = evaluateLicenseExpression(
      parsedLicenseExpression.left,
      config,
    );
    const rightStatus = evaluateLicenseExpression(
      parsedLicenseExpression.right,
      config,
    );
    return evaluateConjunction(
      parsedLicenseExpression.conjunction,
      leftStatus,
      rightStatus,
    );
  }
  return "unknown";
}

function evaluateConjunction(
  conjunction: "or" | "and",
  leftStatus: LicenseStatus,
  rightStatus: LicenseStatus,
): LicenseStatus {
  if (conjunction === "or") {
    if (leftStatus === "whitelist" || rightStatus === "whitelist") {
      return "whitelist";
    }
    if (leftStatus === "blacklist" && rightStatus === "blacklist") {
      return "blacklist";
    }
    return "unknown";
  }
  if (conjunction === "and") {
    if (leftStatus === "blacklist" || rightStatus === "blacklist") {
      return "blacklist";
    }
    if (leftStatus === "whitelist" && rightStatus === "whitelist") {
      return "whitelist";
    }
    return "unknown";
  }
  return "unknown";
}
