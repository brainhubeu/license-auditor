const fs = require("node:fs");
const path = require("node:path");

const directory = "./dist/esm/";
const extension = ".js";
const newExtension = ".mjs";

// Function to update file content and rename files
function processFile(filePath) {
  console.log(`Updating ${filePath} contents...`);

  // Read the file content
  let content = fs.readFileSync(filePath, "utf-8");

  // Replace import/export .js to .mjs
  content = content.replace(
    /(import .*?from\s+['"].*?)(\.js)(['"])/g,
    "$1.mjs$3",
  );
  content = content.replace(
    /(export .*?from\s+['"].*?)(\.js)(['"])/g,
    "$1.mjs$3",
  );

  // Write the updated content back to the file
  fs.writeFileSync(filePath, content, "utf-8");

  // Rename the file from .js to .mjs
  const newFilePath = filePath.replace(extension, newExtension);
  console.log(`Renaming ${filePath} to ${newFilePath}...`);
  fs.renameSync(filePath, newFilePath);
}

// Recursive function to process all files in a directory
function processDirectory(dir) {
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error("Error reading the directory:", err);
      return;
    }

    for (const file of files) {
      const filePath = path.join(dir, file.name);

      if (file.isDirectory()) {
        // Recursively process subdirectories
        processDirectory(filePath);
      } else if (path.extname(file.name) === extension) {
        // Process files with .js extension
        processFile(filePath);
      }
    }
  });
}

// Start processing the main directory
processDirectory(directory);
