import type { License } from "@license-auditor/data";
import type { PackageJsonType } from "../file-utils.js";
import { findLicenseById } from "./find-license-by-id.js";
import type { ResolvedLicenses } from "./licenses-with-path.js";
import { parseLicenseLogicalExpression } from "./parse-license-logical-expression.js";
import { extractLicensesFromExpression } from "./extract-licenses-from-expression.js";

function retrieveLicenseFromTypeField(license: unknown): License[] {
  if (typeof license === "object" && !!license && "type" in license) {
    return findLicenseById(license.type);
  }
  return [];
}

function handleOutdatedFormats(packageJsonField: unknown): License[] {
  if (Array.isArray(packageJsonField)) {
    return packageJsonField.flatMap((l) => {
      const licenses = findLicenseById(l);
      if (!licenses.length) {
        licenses.push(...retrieveLicenseFromTypeField(l));
      }
      return licenses;
    });
  }
  return retrieveLicenseFromTypeField(packageJsonField);
}

function retrieveLicenseByField<T extends "license" | "licenses">(
  packageJson: PackageJsonType,
  licenseField: T,
): ResolvedLicenses {
  if (typeof packageJson[licenseField] === "string") {
    const licenseById = findLicenseById(packageJson[licenseField]);
    if (licenseById.length > 0) {
      return {
        licenses: licenseById,
      };
    }

    const licenseExpressionParsed = parseLicenseLogicalExpression(
      packageJson[licenseField],
    );
    if (licenseExpressionParsed) {
      return {
        licenses: extractLicensesFromExpression(licenseExpressionParsed),
        licenseExpression: packageJson[licenseField],
        licenseExpressionParsed,
      };
    }
  }

  if (typeof packageJson[licenseField] === "object") {
    const fromOutdatedFormat = handleOutdatedFormats(packageJson[licenseField]);
    return {
      licenses: fromOutdatedFormat,
    };
  }

  return {
    licenses: [],
  };
}

export function findLicenseInPackageJson(
  packageJson: PackageJsonType,
): ResolvedLicenses {
  if (packageJson.license) {
    return retrieveLicenseByField(packageJson, "license");
  }
  if (packageJson.licenses) {
    return retrieveLicenseByField(packageJson, "licenses");
  }
  return {
    licenses: [],
  };
}
