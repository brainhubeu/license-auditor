import { Command } from "@commander-js/extra-typings";
import { handler } from "./handler.js";

const program = new Command();

program.name("commander-poc").description("Commander proof of concept");

program
  .command("do-something")
  .description("Split a string into substrings and display as a JSON")
  .argument("<string>", "string to split")
  .option("--first", "display just the first substring")
  .option("-s, --separator <char>", "separator character", ",")
  .action(handler);

program.parse();
