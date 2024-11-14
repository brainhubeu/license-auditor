import { LicenseStatusSchema } from "@license-auditor/data";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import { z } from "zod";
import AuditLicenses from "../components/audit-licenses/audit-licenses.js";
import { ConfigErrorHandler } from "../components/config-error-handler.js";
import { JSON_RESULT_FILE_NAME } from "../constants/options-constants.js";
import { useReadConfiguration } from "../hooks/use-read-config-file.js";
import { useValidateJsonPath } from "../hooks/use-validate-json-path.js";

export const options = z.object({
  verbose: z.boolean().default(false).describe("Verbose output"),
  filter: LicenseStatusSchema.optional().describe(
    "Filter by license status - whitelist, blacklist, or unknown",
  ),
  json: z
    .union([z.string(), z.boolean()])
    .optional()
    .describe(
      `Save the result to a JSON file. If no path is not provided, a file named ${JSON_RESULT_FILE_NAME} will be created in the current directory.`,
    ),
});

export type Options = {
  options: z.infer<typeof options>;
};

export default function Index({ options }: Options) {
  const { configFile, error } = useReadConfiguration();
  const validateJsonResult = useValidateJsonPath(options.json);

  if (error) {
    return <ConfigErrorHandler error={error} />;
  }

  if (configFile?.config && validateJsonResult.validated) {
    return (
      <Box flexDirection="column">
        <Text>Loaded configuration file: {configFile.filepath}</Text>
        <AuditLicenses
          verbose={options.verbose}
          config={configFile.config}
          filter={options.filter}
          json={validateJsonResult.path}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Spinner />
      <Text>Reading configuration...</Text>
    </Box>
  );
}
