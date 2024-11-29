import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/**/*.ts", "./src/**/*.tsx"],
  publicDir: "./public",
  format: ["esm"],
  dts: true,
  platform: "node",
  target: "esnext",
  clean: true,
  outDir: "dist",
  sourcemap: false,
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
  noExternal: ["@brainhubeu/license-auditor-core", "@license-auditor/data"],
});
