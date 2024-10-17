import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function executeConfig(usePredefinedLists: boolean) {
  const currentDir = process.cwd();
  const licenseDir = path.resolve(currentDir, "licenses");

  fs.mkdirSync(licenseDir, { recursive: true });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const templateDir = usePredefinedLists
    ? path.resolve(__dirname, "template/filled")
    : path.resolve(__dirname, "template/blank");
  fs.cpSync(templateDir, licenseDir, { recursive: true });

  // TODO: install package only once we have a way of identifying package manager
  //   exec("npm install @brainhubeu/license-auditor", (error) => {
  //     if (error) {
  //       console.error(`Error installing package: ${error.message}`);
  //       return;
  //     }

  //   });

  console.log("Success! Configured licenses for license-auditor.");
}

export { executeConfig };
