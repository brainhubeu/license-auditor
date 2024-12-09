import { describe, expect, it } from "vitest";
import type { VerificationStatus } from "@license-auditor/data";
import { parseVerificationStatusToMessage } from "./parse-verification-status-to-message.js";

describe("parseVerificationStatusToMessage", () => {
  it("should return correct message for 'licenseFileExistsButUnknownLicense'", () => {
    const status: VerificationStatus = "licenseFileExistsButUnknownLicense";
    const message = parseVerificationStatusToMessage(status, "/path/to/package", "test-package");
    expect(message).toBe(
      'We’ve found a license file, but no matching licenses in it in path /path/to/package. Please review package test-package and assign a matching license or skip the check by listing it in the overrides field of the config file.'
    );
  });

  it("should return correct message for 'licenseFilesExistButSomeAreUncertain'", () => {
    const status: VerificationStatus = "licenseFilesExistButSomeAreUncertain";
    const message = parseVerificationStatusToMessage(status, "/path/to/package", "test-package");
    expect(message).toBe(
      'We\'ve found few license files, but we could not match a license for some of them for package test-package in path /path/to/package. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.'
    );
  });

  it("should return correct message for 'someButNotAllLicensesWhitelisted'", () => {
    const status: VerificationStatus = "someButNotAllLicensesWhitelisted";
    const message = parseVerificationStatusToMessage(status, "/path/to/package", "test-package");
    expect(message).toBe(
      'Some but not all licenses are whitelisted for package test-package in path /path/to/package. Please review the package.'
    );
  });

  it("should return correct message for 'licenseFileNotFound'", () => {
    const status: VerificationStatus = "licenseFileNotFound";
    const message = parseVerificationStatusToMessage(status, "/path/to/package", "test-package");
    expect(message).toBe(
      'We couldn’t find a license file for package test-package in path /path/to/package. Please review the package and assign a matching license or skip the check by listing it in the overrides field of the config file.'
    );
  });

  it("should return correct message for 'ok'", () => {
    const status: VerificationStatus = "ok";
    const message = parseVerificationStatusToMessage(status, "/path/to/package", "test-package");
    expect(message).toBe(
      'Package test-package in path /path/to/package has a valid license.'
    );
  });
});
