import { Box, Text, useApp } from "ink";
import React, { useState, useEffect } from "react";
import { SpinnerWithLabel } from "../components/spinner-with-label.js";
import type { AuditLicensesOptions } from "../options.js";
import { auditLicenses } from "@brainhubeu/license-auditor-core";

export default function AuditLicenses({ options }: AuditLicensesOptions) {
  const [working, setWorking] = useState(true);
  const [error, setError] = useState(false);
  const { exit } = useApp();

  // const [results, setResults] = useState<any>([]);

  useEffect(() => {
    setWorking(true);

    const getResults = async () => {
      try {
        const result = await auditLicenses(process.cwd());
        console.log("Result:", result);
        // setResults(result);
      } catch (err) {
        // todo: handle errors properly
        setError(true);
        exit();
      }
    };
    void getResults();
    setWorking(false);
  }, [exit]);

  if (error) {
    return (
      <Box borderStyle="single" borderColor="red">
        <Text color="red">Config file does not exist or failed to load</Text>
      </Box>
    );
  }

  if (working && !options.verbose) {
    return <SpinnerWithLabel label="Processing licenses..." />;
  }

  return (
    <Box flexDirection="column">
      {/* {options.verbose && !error && (
        <Static items={processed}>
          {(item) => (
            <Box
              key={item.modulePath}
              flexDirection="column"
              borderStyle="single"
            >
              <Text>Module path: {item.modulePath}</Text>
              <Text>License: {item.license}</Text>
              <Text>License path: {item.licensePath}</Text>
            </Box>
          )}
        </Static>
      )} */}
      {/* <Box flexDirection="column" borderStyle="single" borderColor="white">
        <Box>
          <Text>Licenses found: {processed.length}</Text>
        </Box>
        <Box>
          <Text>
            Valid licenses: {processed.filter((item) => !item.error).length}
          </Text>
        </Box>
        <Box>
          <Text color="red">
            Prohibited licenses: {processed.filter((item) => item.error).length}
          </Text>
        </Box>
      </Box> */}
    </Box>
  );
}
