import { cosmiconfig } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";
import { MODULE_NAME } from "../constants/config-constants.js";
import { envSchema } from "../env.js";

async function readConfiguration() {
  const explorer = cosmiconfig(MODULE_NAME, {
    loaders: {
      ".ts": TypeScriptLoader(),
    },
  });

  const parsedEnv = envSchema.safeParse(process.env);

  const configFile = await explorer.search(parsedEnv.data?.ROOT_DIR);
  return configFile;
}

export { readConfiguration };
