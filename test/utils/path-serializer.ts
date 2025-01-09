import { expect } from "vitest";
import { TEST_TEMP_DIRECTORY } from "../global-setup";

const pathSerializer = {
  test: (val: unknown): boolean => {
    if (typeof val !== "string" && typeof val !== "object") {
      return false;
    }

    const stringified = JSON.stringify(val);
    return stringified.includes(TEST_TEMP_DIRECTORY);
  },

  serialize: (val: unknown): string => {
    const stringified = JSON.stringify(val, null, 2);
    return stringified.replace(
      new RegExp(`${TEST_TEMP_DIRECTORY}/testProject-[a-zA-Z0-9]+`, "g"),
      "<TEST_DIR>",
    );
  },
};

expect.addSnapshotSerializer(pathSerializer);
