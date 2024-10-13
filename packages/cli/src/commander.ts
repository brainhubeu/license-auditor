import { Command } from "@commander-js/extra-typings";
import { handler } from "./handler.js";

const program = new Command();

program.name("commander-poc").description("Commander proof of concept");

program
  .command("do-something")
  .description("Process provided licenses")
  .option("--verbose", "display just the first substring")
  .action(handler);

program.parse();
