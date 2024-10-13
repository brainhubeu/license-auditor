import { Box, Static, Text } from "ink";
import React, { useState, useEffect } from "react";
import zod from "zod";
import Spinner from "../components/spinner.js";
import { licenses } from "../mocks.js";

export const options = zod.object({
  verbose: zod.boolean().default(false).describe("Verbose output"),
});

type Props = {
  options: zod.infer<typeof options>;
};

const process = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 5000);
  });

export default function Index({ options }: Props) {
  const [working, setWorking] = useState(true);

  const [processed, setProcessed] = useState<
    {
      modulePath: string;
      license: string;
      licensePath: string;
      error: boolean;
    }[]
  >([]);

  useEffect(() => {
    setWorking(true);

    for (const license of licenses) {
      setTimeout(
        () =>
          setProcessed((existing) => [
            ...existing,
            {
              modulePath: license.modulePath,
              license: license.license,
              licensePath: license.licensePath,
              error: license.license !== "MIT",
            },
          ]),
        500,
      );
    }

    setWorking(false);
  }, []);

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
      {options.verbose ? (
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
      ) : (
        <Box borderStyle="single" borderColor="white">
          <Text>Licenses found: {processed.length}</Text>
        </Box>
      )}
    </Box>
  );
}
