import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React from "react";
import { useReadConfiguration } from "../hooks/use-read-config-file.js";
import type { CliOptions } from "../options.js";
import AuditLicenses from "./audit-licenses.js";

export default function Index({ options }: CliOptions) {
  const { configFile } = useReadConfiguration();

  // todo: handle errors thrown in readConfiguration - prompt the user accordingly
  // for now let's assume all is well and the file's been found
  if (configFile?.config) {
    return (
      <AuditLicenses options={{ ...options, config: configFile.config }} />
    );
  }

  return (
    <Box>
      <Spinner />
      <Text>Reading configuration...</Text>
    </Box>
  );
}
