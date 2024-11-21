import { defineConfig } from "vitest/config";

// biome-ignore lint/style/noDefaultExport: this is a config file
export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "lcov"], // lcov for Coveralls
      reportsDirectory: "./coverage",
    },
  },
});
