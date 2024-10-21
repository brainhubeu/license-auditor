import zod from "zod";

export const cliOptions = zod.object({
  verbose: zod.boolean().default(false).describe("Verbose output"),
});

export type CliOptions = {
  options: zod.infer<typeof cliOptions>;
};
