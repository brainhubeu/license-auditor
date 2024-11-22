import type { ConfigType } from "@brainhubeu/license-auditor-cli";

const config: ConfigType = {
  blacklist: [],
  whitelist: [],
  overrides: {
    warn: [],
    off: [],
  },
};

export default config;
