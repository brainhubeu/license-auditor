import type { ConfigType } from "@license-auditor/config";

async function readConfiguration(callback: (config: ConfigType) => unknown) {
  const currentDir = process.cwd();
  try {
    const { overrides } = await import(
      `${currentDir}/licenseauditor.config.js`
    );
    callback(overrides);
  } catch (err) {
    console.error(
      "Failed to load configuration file at location:",
      `${currentDir}/license-auditor.config.js`,
    );
    console.error(
      "Please make sure the config.js exists at the root of your project.",
    );
  }
}

export { readConfiguration };
