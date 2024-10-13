import { Box, Text } from "ink";
import React, { useState, useEffect } from "react";
import zod from "zod";
import { licenses } from "../mocks.js";
import Spinner from "../components/spinner.js";

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
    }, 2000);
  });

export default function Index({ options }: Props) {
  const [{ working, error }, setState] = useState({
    working: true,
    error: false,
  });

  useEffect(() => {
    process()
      .then(() => setState({ working: false, error: false }))
      .catch(() => setState({ working: false, error: true }));
  }, []);

  if (working) {
    return (
      <Box>
        <Spinner />
        <Text>Loading...</Text>
      </Box>
    );
  }

  if (error) {
    return <Text color="red">Encountered an error</Text>;
  }

  return (
    <Box flexDirection="column">
      {options.verbose ? (
        licenses.map((license) => (
          <Box
            flexDirection="column"
            marginBottom={1}
            borderStyle="single"
            borderColor="white"
          >
            <Text>{license.modulePath}</Text>
            <Text>{license.license}</Text>
            <Text>{license.licensePath}</Text>
          </Box>
        ))
      ) : (
        <Box borderStyle="single" borderColor="white">
          <Text>Licenses found: {licenses.length}</Text>
        </Box>
      )}
    </Box>
  );
}
