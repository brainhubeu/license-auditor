export const MODULE_NAME = "license-auditor";

export const supportedExtensions = [".js", ".ts", ".mjs", ".cjs"] as const;

export const supportedConfigFiles = supportedExtensions.map(
  (extension) => `${MODULE_NAME}.config${extension}`,
);
