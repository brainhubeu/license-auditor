import { licenseMap } from "@license-auditor/data";
import { describe, expect, it } from "vitest";
import { detectLicenses, tokenize } from "./detect-from-license-content.js";

describe("detectFromLicenseContent", () => {
  describe("tokenize", () => {
    it("tokenizes", () => {
      const tokenized = tokenize("Foo, bar:bam. baz");
      expect(tokenized).toEqual(["Foo", "bar", "bam", "baz"]);
    });
  });
  describe("detectFromLicenseContent", () => {
    it("detects license from license content", () => {
      const licenseContents = licenseMap.get("MIT")?.licenseText;

      if (!licenseContents) {
        throw new Error("MIT doesn't have license text");
      }
      expect(detectLicenses(licenseContents)[0]?.licenseId).toBe("MIT");
    });
  });
});
