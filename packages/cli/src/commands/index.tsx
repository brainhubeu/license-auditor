import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { useReadConfiguration } from "../hooks/use-read-config-file.js";
import AuditLicenses from "../components/audit-licenses/audit-licenses.js";
import { z } from "zod";

export const options = z.object({
  verbose: z.boolean().default(false).describe("Verbose output"),
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
      <AuditLicenses verbose={options.verbose} config={configFile.config} />
    );
  }

  return (
    <Box>
      <Spinner />
      <Text>Reading configuration...</Text>
    </Box>
  );
}
