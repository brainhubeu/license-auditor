import { defineConfig } from "tsup";

// biome-ignore lint/style/noDefaultExport: needed for tsup
export default defineConfig({
  entry: ["find-package-manager.ts"],
  format: ["esm"],
  platform: "node",
  target: "esnext",
  dts: true,
  clean: true,
  outDir: "dist",
  sourcemap: true,
  noExternal: ["detect-package-manager", "execa"],
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
});
