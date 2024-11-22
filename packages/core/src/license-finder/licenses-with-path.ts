import type { DetectedLicense, License } from "@license-auditor/data";
import type { Info } from "spdx-expression-parse";

export type LicensesWithPath = Pick<
  DetectedLicense,
  "licensePath" | "verificationStatus"
> &
  ResolvedLicenses;

export type ResolvedLicenses =
  | {
      licenses: License[];
      licenseExpression?: undefined;
      licenseExpressionParsed?: undefined;
    }
  | {
      licenses: License[];
      licenseExpression: string;
      licenseExpressionParsed: Info;
    };
