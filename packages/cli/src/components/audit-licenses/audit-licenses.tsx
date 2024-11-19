import { auditLicenses } from "@brainhubeu/license-auditor-core";
import type {
  ConfigType,
  LicenseAuditResult,
  LicenseStatus,
} from "@license-auditor/data";
import { useApp } from "ink";
import { useEffect, useState } from "react";
import { envSchema } from "../../env.js";
import { saveResultToJson } from "../../utils/save-result-to-json.js";
import { SpinnerWithLabel } from "../spinner-with-label.js";
import ErrorBox from "./error-box.js";
import AuditResult from "./audit-result.js";

export type AuditLicensesProps = {
  verbose: boolean;
  config: ConfigType;
  filter: LicenseStatus | undefined;
  json: string | undefined;
};

export default function AuditLicenses({
  verbose,
  config,
  filter,
  json,
}: AuditLicensesProps) {
  const [working, setWorking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
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
        const { warning, ...result } = await auditLicenses(
          parsedEnv.data.ROOT_DIR,
          config,
        );
        setResult(result);
        if (warning) {
          setWarning(warning);
        }
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
  }, [exit, config]);

  useEffect(() => {
    if (result && json) {
      saveResultToJson(result, json);
    }
  }, [json, result]);

  if (error) {
    return (
      <ErrorBox>An error occurred while auditing licenses: {error}</ErrorBox>
    );
  }

  if (working || !result) {
    return <SpinnerWithLabel label="Processing licenses..." />;
  }

  return (
    <AuditResult
      result={result}
      verbose={verbose}
      filter={filter}
      warning={warning}
    />
  );
}
