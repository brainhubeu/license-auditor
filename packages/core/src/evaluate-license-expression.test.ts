import type { ConfigType } from "@license-auditor/data";
import type { Info } from "spdx-expression-parse";
import { describe, expect, it } from "vitest";
import { evaluateLicenseExpression } from "./evaluate-license-expression.js";

describe("evaluateLicenseExpression", () => {
  const config: ConfigType = {
    whitelist: ["ISC", "MIT", "Apache-2.0"],
    blacklist: ["GPL-3.0", "AGPL-3.0"],
  };

  it("should return the status of a multiple license", () => {
    const parsedLicenseExpression: Info = {
      left: { license: "MIT" },
      conjunction: "or",
      right: { license: "Apache-2.0" },
    };

    const result = evaluateLicenseExpression(parsedLicenseExpression, config);

    expect(result).toBe("whitelist");
  });

  it("should return the status of a single license", () => {
    const parsedLicenseExpression: Info = { license: "MIT" };

    const result = evaluateLicenseExpression(parsedLicenseExpression, config);

    expect(result).toBe("whitelist");
  });

  it("should return the status of a blacklisted license", () => {
    const parsedLicenseExpression: Info = { license: "GPL-3.0" };

    const result = evaluateLicenseExpression(parsedLicenseExpression, config);

    expect(result).toBe("blacklist");
  });

  it("should return the status of a multiple license with blacklist", () => {
    const parsedLicenseExpression: Info = {
      left: { license: "MIT" },
      conjunction: "or",
      right: { license: "GPL-3.0" },
    };

    const result = evaluateLicenseExpression(parsedLicenseExpression, config);

    expect(result).toBe("whitelist");
  });

  it("should return unknown for an unknown license", () => {
    const parsedLicenseExpression: Info = { license: "Unknown-License" };

    const result = evaluateLicenseExpression(parsedLicenseExpression, config);

    expect(result).toBe("unknown");
  });

  it("should return the status of a multiple license with conjunction 'and'", () => {
    const parsedLicenseExpression: Info = {
      left: { license: "MIT" },
      conjunction: "and",
      right: { license: "Apache-2.0" },
    };

    const result = evaluateLicenseExpression(parsedLicenseExpression, config);

    expect(result).toBe("whitelist");
  });

  it("should return the status of a multiple license with conjunction 'and' and blacklist", () => {
    const parsedLicenseExpression: Info = {
      left: { license: "MIT" },
      conjunction: "and",
      right: { license: "GPL-3.0" },
    };

    const result = evaluateLicenseExpression(parsedLicenseExpression, config);

    expect(result).toBe("blacklist");
  });
});
