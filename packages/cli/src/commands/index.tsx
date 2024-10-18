import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React from "react";
import { useReadConfiguration } from "../hooks/use-read-config-file.js";
import type { AuditLicensesOptions } from "../options.js";
import AuditLicenses from "./audit-licenses.js";

export default function Index({ options }: AuditLicensesOptions) {
  const { isRetrievingConfig } = useReadConfiguration();

  if (isRetrievingConfig) {
    <Box>
      <Spinner />
      <Text>Reading configuration...</Text>
    </Box>;
  }
  // todo: handle errors thrown in readConfiguration - prompt the user accordingly
  // for now let's assume all is well and the file's been found
  return <AuditLicenses options={options} />;
}
