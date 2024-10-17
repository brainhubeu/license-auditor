import type { LicenseId } from "@license-auditor/licenses";
import { Box, Static, Text, useApp } from "ink";
import React, { useState, useEffect } from "react";
import zod from "zod";
import Spinner from "../components/spinner.js";
import { licenses } from "../mocks.js";
import { readConfiguration } from "../utils/read-configuration.js";

export const options = zod.object({
  verbose: zod.boolean().default(false).describe("Verbose output"),
});

type Props = {
  options: zod.infer<typeof options>;
};

export default function Index({ options }: Props) {
  const [working, setWorking] = useState(true);
  const [error, setError] = useState(false);
  const { exit } = useApp();

  const [processed, setProcessed] = useState<
    {
      modulePath: string;
      license: LicenseId;
      licensePath: string;
      error: boolean;
    }[]
  >([]);

  useEffect(() => {
    setWorking(true);

    try {
      readConfiguration((config) => {
        for (const license of licenses) {
          setProcessed((currentProcessed) => [
            ...currentProcessed,
            {
              modulePath: license.modulePath,
              license: license.license,
              licensePath: license.licensePath,
              error: config.blacklist.includes(license.license),
            },
          ]);
        }
      });
    } catch (err) {
      setError(true);
      exit();
    }
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
    return (
      <Box>
        <Spinner />
        <Text>Processing licenses...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {options.verbose && !error && (
        <Static items={processed}>
          {(item) => (
            <Box
              key={item.modulePath}
              flexDirection="column"
              borderStyle="single"
              borderColor={item.error ? "red" : "white"}
            >
              <Text>Module path: {item.modulePath}</Text>
              <Text>License: {item.license}</Text>
              <Text>License path: {item.licensePath}</Text>
            </Box>
          )}
        </Static>
      )}
      <Box flexDirection="column" borderStyle="single" borderColor="white">
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
      </Box>
    </Box>
  );
}
