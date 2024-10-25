import {
  type LicenseAuditResult,
  auditLicenses,
} from "@brainhubeu/license-auditor-core";
import { Box, Text, useApp } from "ink";
import { useEffect, useState } from "react";
import { z as zod } from "zod";
import AuditResult from "../components/audit-result";
import { SpinnerWithLabel } from "../components/spinner-with-label";
import { cliOptions } from "../options";

export const auditLicensesOptions = cliOptions.extend({
  config: zod.any(),
});

export type AuditLicensesOptions = {
  options: zod.infer<typeof auditLicensesOptions>;
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
