import { auditLicenses } from "@brainhubeu/license-auditor-core";
import { ConfigSchema } from "@license-auditor/data";
import { Box, Text, useApp } from "ink";
import React, { useState, useEffect } from "react";
import type { z } from "zod";
import AuditResult from "../components/AuditResult.js";
import { SpinnerWithLabel } from "../components/spinner-with-label.js";
import { cliOptions } from "../options.js";

export const auditLicensesOptions = cliOptions.extend({
  config: ConfigSchema,
});

export type AuditLicensesOptions = {
  options: z.infer<typeof auditLicensesOptions>;
};

export default function AuditLicenses({ options }: AuditLicensesOptions) {
  const [working, setWorking] = useState(true);
  const [error, setError] = useState(false);
  const { exit } = useApp();

  useEffect(() => {
    setWorking(true);

    const getResults = async () => {
      try {
        const result = await auditLicenses(process.cwd(), options.config);
        console.log("Result:", result);
        // Here you would process the result and set the appropriate state
        setWorking(false);
      } catch (err) {
        console.error(err);
        setError(true);
        exit();
      }
    };
    void getResults();
  }, [exit, options.config]);

  if (error) {
    return (
      <Box borderStyle="single" borderColor="red">
        <Text color="red">An error occurred while auditing licenses.</Text>
      </Box>
    );
  }

  if (working && !options.verbose) {
    return <SpinnerWithLabel label="Processing licenses..." />;
  }

  return <AuditResult />;
}
