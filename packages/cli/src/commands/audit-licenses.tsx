import { auditLicenses } from "@brainhubeu/license-auditor-core";
import { ConfigSchema, type LicenseAuditResult } from "@license-auditor/data";
import { Box, Text, useApp } from "ink";
import React, { useState, useEffect } from "react";
import type { z } from "zod";
import AuditResult from "../components/audit-result.js";
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
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<LicenseAuditResult | null>(null);
  const { exit } = useApp();

  useEffect(() => {
    setWorking(true);

    const getResults = async () => {
      try {
        const auditResult = await auditLicenses(process.cwd(), options.config);
        setResult(auditResult);
        setWorking(false);
        exit();
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
        setWorking(false);
        exit();
      }
    };
    void getResults();
  }, [exit, options.config]);

  if (error) {
    return (
      <Box borderStyle="single" borderColor="red">
        <Text color="red">
          An error occurred while auditing licenses: {error.message}
        </Text>
      </Box>
    );
  }

  if (working || !result) {
    return <SpinnerWithLabel label="Processing licenses..." />;
  }

  return <AuditResult result={result} />;
}
