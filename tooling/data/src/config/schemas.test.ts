import { describe, expect, it } from "vitest";
import { ConfigSchema } from "./schemas.js";

describe("ConfigSchema", () => {
  it("should validate a valid config", () => {
    const config = {
      blacklist: [
        "AGPL-1.0-only",
        "AGPL-1.0-or-later",
        "AGPL-3.0-only",
        "AGPL-3.0-or-later",
        "CNRI-Python-GPL-Compatible",
        "GPL-1.0-only",
        "GPL-1.0-or-later",
        "GPL-2.0-only",
        "GPL-2.0-or-later",
        "GPL-3.0-only",
        "GPL-3.0-or-later",
        "LGPL-2.0-only",
        "LGPL-2.0-or-later",
        "LGPL-2.1-only",
        "LGPL-2.1-or-later",
        "LGPL-3.0-only",
        "LGPL-3.0-or-later",
        "LGPLLR",
        "NGPL",
      ],
      whitelist: [
        "0BSD",
        "Apache-2.0",
        "BSD-2-Clause",
        "BSD-3-Clause",
        "ISC",
        "MIT",
        "CPOL-1.02",
      ],
      overrides: {
        "package-name-warn": "warn",
        "package-name-off": "off",
      },
    };

    const result = ConfigSchema.safeParse(config);

    expect(result.success).toBe(true);
  });

  it("should return an error when licenseId is not valid", () => {
    const config = {
      blacklist: ["unlicense", "mIT"],
      whitelist: [],
      overrides: {},
    };
    const result = ConfigSchema.safeParse(config);

    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(2);
    expect(result.error?.issues[0]?.message).toBe(
      "Invalid license with value: unlicense. Did you mean: Unlicense?",
    );
    expect(result.error?.issues[1]?.message).toBe(
      "Invalid license with value: mIT. Did you mean: MIT?",
    );
  });

  it("should return an error when licenseId is not valid", () => {
    const config = {
      blacklist: [5],
      whitelist: [],
    };

    const result = ConfigSchema.safeParse(config);

    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(1);
    expect(result.error?.issues[0]?.message).toBe(
      "Invalid license with value: 5.",
    );
  });
});
