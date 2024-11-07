import { LicenseStatusSchema } from "@license-auditor/data";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { z } from "zod";
import AuditLicenses from "../components/audit-licenses/audit-licenses.js";
import { useReadConfiguration } from "../hooks/use-read-config-file.js";

export const options = z.object({
  verbose: z.boolean().default(false).describe("Verbose output"),
  filter: LicenseStatusSchema.optional().describe(
    "Filter by license status - whitelist, blacklist, or unknown",
  ),
});

export type Options = {
  options: z.infer<typeof options>;
};

export default function Index({ options }: Options) {
  const { configFile } = useReadConfiguration();

  // todo: handle errors thrown in readConfiguration - prompt the user accordingly
  // for now let's assume all is well and the file's been found
  if (configFile?.config) {
    return (
      <AuditLicenses
        verbose={options.verbose}
        config={configFile.config}
        filter={options.filter}
      />
    );
  }

  return (
    <Box>
      <Spinner />
      <Text>Reading configuration...</Text>
    </Box>
  );
}
