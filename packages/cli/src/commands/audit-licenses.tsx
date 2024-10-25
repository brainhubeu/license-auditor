import { auditLicenses } from "@brainhubeu/license-auditor-core";
import { ConfigSchema, type LicenseAuditResult } from "@license-auditor/data";
import { Box, Text, useApp } from "ink";
import { useEffect, useState } from "react";
import { z } from "zod";
import AuditResult from "../components/audit-result.js";
import { SpinnerWithLabel } from "../components/spinner-with-label.js";
import { cliOptions } from "../options.js";

export const auditLicensesOptions = cliOptions.extend({
  config: ConfigSchema,
});

export type AuditLicensesOptions = {
  options: z.infer<typeof auditLicensesOptions>;
};

const envSchema = z.object({
  // biome-ignore lint/style/useNamingConvention: this is a constant
  ROOT_DIR: z.string().min(1).default(process.cwd()),
});

export default function AuditLicenses({ options }: AuditLicensesOptions) {
  const [working, setWorking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LicenseAuditResult | null>(null);
  const { exit } = useApp();

  useEffect(() => {
    setWorking(true);

    const getResults = async () => {
      try {
        const parsedEnv = envSchema.safeParse(process.env);
        if (parsedEnv.error) {
          setError(parsedEnv.error.message);
          return;
        }
        const result = await auditLicenses(
          parsedEnv.data.ROOT_DIR,
          options.config,
        );
        console.log("Result:", result);
        setResult(result);
        setWorking(false);
        exit();
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
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
          An error occurred while auditing licenses: {error}
        </Text>
      </Box>
    );
  }

  if (working || !result) {
    return <SpinnerWithLabel label="Processing licenses..." />;
  }

  return <AuditResult result={result} verbose={options.verbose} />;
}
