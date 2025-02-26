import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: this is a config file
export default defineConfig({
  test: {
    include: ["./**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    coverage: {
      reporter: ["text", "lcov"], // lcov for Coveralls
      reportsDirectory: "./coverage",
    },
  },
});
