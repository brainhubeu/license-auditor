import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["./**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    coverage: {
      reporter: ["text", "lcov"], // lcov for Coveralls
      reportsDirectory: "./coverage",
    },
  },
});
