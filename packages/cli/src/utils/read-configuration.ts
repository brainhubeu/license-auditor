import { cosmiconfig } from "cosmiconfig";
import { MODULE_NAME } from "../constants/config-constants.js";

async function readConfiguration() {
  const explorer = cosmiconfig(MODULE_NAME);

  const configFile = await explorer.search();
  return configFile;
}

export { readConfiguration };
