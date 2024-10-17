import type { ConfigType } from "@license-auditor/config";
import { cosmiconfig } from "cosmiconfig";

async function readConfiguration(callback: (config: ConfigType) => unknown) {
  const explorer = cosmiconfig("license-auditor");

  explorer
    .load("license-auditor.config.js")
    .then((config) => {
      if (config?.config) {
        callback(config.config as ConfigType);
      }
    })
    .catch((err) => {
      console.error("Failed to load configuration file at location:", err);
      console.error(
        "Please make sure the config.js exists within your project.",
      );
    });
}

export { readConfiguration };
