import { LICENSE_SOURCE, type License } from "@license-auditor/data";
import type { PackageJsonType } from "../file-utils.js";
import { addLicenseSource } from "./add-license-source.js";
import { extractLicensesFromExpression } from "./extract-licenses-from-expression.js";
import { findLicenseById } from "./find-license-by-id.js";
import type { ResolvedLicenses } from "./licenses-with-path.js";
import { parseLicenseLogicalExpression } from "./parse-license-logical-expression.js";

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
      return addLicenseSource(licenses, LICENSE_SOURCE.packageJsonLegacy);
    });
  }
  return addLicenseSource(
    retrieveLicenseFromTypeField(packageJsonField),
    LICENSE_SOURCE.packageJsonLegacy,
  );
}

function retrieveLicenseByField<T extends "license" | "licenses">(
  packageJson: PackageJsonType,
  licenseField: T,
): ResolvedLicenses {
  if (typeof packageJson[licenseField] === "string") {
    const licenseById = findLicenseById(packageJson[licenseField]);
    if (licenseById.length > 0) {
      return {
        licenses: addLicenseSource(
          licenseById,
          licenseField === "license"
            ? LICENSE_SOURCE.packageJsonLicense
            : LICENSE_SOURCE.packageJsonLicenses,
        ),
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
      licenses: addLicenseSource(
        fromOutdatedFormat,
        LICENSE_SOURCE.packageJsonLegacy,
      ),
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
