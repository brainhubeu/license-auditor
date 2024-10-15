const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");

const currentDir = process.cwd();
const licenseDir = path.resolve(currentDir, 'licenses');


const usePredefinedLists = process.argv[2] === '--use-default';

fs.mkdirSync(licenseDir, { recursive: true });

const templateDir = usePredefinedLists
  ? path.resolve(__dirname, "template/filled")
  : path.resolve(__dirname, "template/blank");
fs.cpSync(templateDir, licenseDir, { recursive: true });

spawn("npm", ["install"," license-auditor"]);

console.log("Success! Configured licenses for license-auditor.");
