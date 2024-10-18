import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

try {
  const currentDir = process.cwd();
  const usePredefinedLists = process.argv[2] === "--use-default";

  fs.mkdirSync(currentDir, { recursive: true });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = usePredefinedLists
    ? path.resolve(__dirname, "template/filled")
    : path.resolve(__dirname, "template/blank");
  fs.cpSync(templateDir, currentDir, { recursive: true });

  console.log("Success!");
  if (usePredefinedLists) {
    console.log(
      `Created a default license list for license-auditor at ${currentDir}/license-auditor.config.js`,
    );
  } else {
    console.log(
      `Created a blank license list for license-auditor at ${currentDir}/license-auditor.config.js`,
    );
  }
} catch (err) {
  console.error("Failed to complete license configuration: ", err);
}
