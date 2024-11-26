import { cosmiconfig } from "cosmiconfig";
import { MODULE_NAME } from "../constants/config-constants.js";
import { envSchema } from "../env.js";

async function readConfiguration() {
  const explorer = cosmiconfig(MODULE_NAME);

  const parsedEnv = envSchema.safeParse(process.env);

  const configFile = await explorer.search(parsedEnv.data?.ROOT_DIR);
  return configFile;
}

export { readConfiguration };
