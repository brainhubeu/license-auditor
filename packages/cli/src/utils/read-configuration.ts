import { cosmiconfig } from "cosmiconfig";

async function readConfiguration() {
  const explorer = cosmiconfig("license-auditor");

  const configFile = await explorer.search();
  if (configFile?.isEmpty) {
    // todo: prompt the user whether they'd like to use our default config or set up their own
    throw new Error("Configuration file has been found but it's empty");
  }
  if (configFile?.config) {
    return configFile;
  }
  // todo: prompt the user to initialize one
  throw new Error("Configuration file has not been found.");
}

export { readConfiguration };
