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

function handleOutdatedFormats(
  packageJsonField: unknown,
  packageJsonPath: string,
): License[] {
  if (Array.isArray(packageJsonField)) {
    return packageJsonField.flatMap((l) => {
      const licenses = findLicenseById(l);
      if (!licenses.length) {
        licenses.push(...retrieveLicenseFromTypeField(l));
      }
      return addLicenseSource(
        licenses,
        LICENSE_SOURCE.packageJsonLegacy,
        packageJsonPath,
      );
    });
  }
  return addLicenseSource(
    retrieveLicenseFromTypeField(packageJsonField),
    LICENSE_SOURCE.packageJsonLegacy,
    packageJsonPath,
  );
}

function retrieveLicenseByField<T extends "license" | "licenses">(
  packageJson: PackageJsonType,
  licenseField: T,
  packageJsonPath: string,
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
          packageJsonPath,
        ),
      };
    }

    const licenseExpressionParsed = parseLicenseLogicalExpression(
      packageJson[licenseField],
    );

    if (licenseExpressionParsed) {
      return {
        licenses: extractLicensesFromExpression(
          licenseExpressionParsed,
          packageJsonPath,
        ),
        licenseExpression: packageJson[licenseField],
        licenseExpressionParsed,
      };
    }
  }

  if (typeof packageJson[licenseField] === "object") {
    const fromOutdatedFormat = handleOutdatedFormats(
      packageJson[licenseField],
      packageJsonPath,
    );
    return {
      licenses: addLicenseSource(
        fromOutdatedFormat,
        LICENSE_SOURCE.packageJsonLegacy,
        packageJsonPath,
      ),
    };
  }

  return {
    licenses: [],
  };
}

export function findLicenseInPackageJson(
  packageJson: PackageJsonType,
  packageJsonPath: string,
): ResolvedLicenses {
  if (packageJson.license) {
    return retrieveLicenseByField(packageJson, "license", packageJsonPath);
  }
  if (packageJson.licenses) {
    return retrieveLicenseByField(packageJson, "licenses", packageJsonPath);
  }
  return {
    licenses: [],
  };
}
