import { executeConfig } from "../utils/execute-config.js";

const usePredefinedLists = process.argv[2] === "--use-default";

executeConfig(usePredefinedLists);
