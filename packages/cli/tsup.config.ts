import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src"],
  format: ["esm"],
  dts: true,
  clean: true,
  outDir: "dist",
  sourcemap: true,
  noExternal: [
    "@brainhubeu/license-auditor-core",
    "@license-auditor/data",
    "@license-auditor/package-manager-finder",
  ],
});
