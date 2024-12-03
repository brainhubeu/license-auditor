import { describe, expect, test } from "vitest";

import { packageJsonSchema } from "./file-utils.js";

describe("packageJsonSchema", () => {
  describe("should validate correctly", () => {
    test("when there are no license nor licenses", () => {
      expect(packageJsonSchema.safeParse({ name: "valid" }).success).toBe(true);
    });
    test("when license is valid string", () => {
      expect(
        packageJsonSchema.safeParse({ name: "valid", license: "MIT" }).success,
      ).toBe(true);
    });
    test("when license is valid object", () => {
      expect(
        packageJsonSchema.safeParse({
          name: "valid",
          license: { type: "MIT", url: "https://mit.edu" },
        }).success,
      ).toBe(true);
    });
    test("when license is object and url is missing", () => {
      expect(
        packageJsonSchema.safeParse({
          name: "valid",
          license: { type: "MIT" },
        }).success,
      ).toBe(true);
    });
    test("when licenses are array of string", () => {
      expect(
        packageJsonSchema.safeParse({ name: "valid", licenses: ["MIT"] })
          .success,
      ).toBe(true);
    });
    test("when licenses is a string", () => {
      expect(
        packageJsonSchema.safeParse({ name: "valid", licenses: "MIT" }).success,
      ).toBe(true);
    });

    test("when licenses are array of object", () => {
      expect(
        packageJsonSchema.safeParse({
          name: "valid",
          licenses: [{ type: "MIT", url: "https://mit.edu" }],
        }).success,
      ).toBe(true);
    });

    test("when license is valid and licenses are not valid", () => {
      expect(
        packageJsonSchema.safeParse({
          name: "valid",
          license: "MIT",
          licenses: [400],
        }).success,
      ).toBe(true);
    });

    test("when license is not valid and licenses are valid", () => {
      expect(
        packageJsonSchema.safeParse({
          name: "valid",
          license: 400,
          licenses: ["MIT"],
        }).success,
      ).toBe(true);
    });
  });

  describe("should fail", () => {
    test("when license is not valid and licenses are missing", () => {
      expect(
        packageJsonSchema.safeParse({ name: "invalid", license: 400 }).success,
      ).toBe(false);
    });
    test("when licenses are invalid and license is missing", () => {
      expect(
        packageJsonSchema.safeParse({ name: "invalid", licenses: [400] })
          .success,
      ).toBe(false);
    });
    test("when both license and licenses are invalid", () => {
      expect(
        packageJsonSchema.safeParse({
          name: "invalid",
          license: 400,
          licenses: [400],
        }).success,
      ).toBe(false);
    });
  });
});
