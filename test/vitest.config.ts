/// <reference types="vitest" />
import { defineConfig } from "vite";

// biome-ignore lint/style/noDefaultExport: Vite requires a default export for its configuration
export default defineConfig({
  test: {
    include: ["./test/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    setupFiles: ["./test/test-project-setup.ts"],
    fileParallelism: false,
  },
});
