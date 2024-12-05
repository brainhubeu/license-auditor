/// <reference types="vitest" />
import { defineConfig } from "vite";

// biome-ignore lint/style/noDefaultExport: Vite requires a default export for its configuration
export default defineConfig({
  test: {
    testTimeout: 30000,
    include: ["./**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    globalSetup: ["./global-setup.ts"],
    sequence: {
      concurrent: true,
    },
  },
});
