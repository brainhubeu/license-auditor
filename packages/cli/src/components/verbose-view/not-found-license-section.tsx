import figures from "figures";
import { Box, Text } from "ink";
import React from "react";

function NotFoundLicenseDetails({
  packageName,
  packagePath,
  errorMessage,
}: {
  packageName: string;
  packagePath: string;
  errorMessage?: string;
}) {
  return (
    <Box key={packageName} flexDirection="row" marginBottom={1}>
      <Box>
        <Text color="yellow">{figures.warning}</Text>
      </Box>
      <Box marginLeft={2}>
        <Box key={packageName} flexDirection="column">
          <Text>
            Package: <Text color="cyan">{packageName}</Text>
          </Text>
          {errorMessage && (
            <Text>
              Error message: <Text color="red">{errorMessage}</Text>
            </Text>
          )}
          <Text>
            License Path: <Text color="blue">{packagePath}</Text>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

export function NotFoundLicenseSection({
  notFound,
}: {
  notFound: Map<string, { packagePath: string; errorMessage: string }>;
}) {
  return (
    <Box flexDirection="column">
      <Text bold>Packages with No License Found</Text>
      <Text italic>
        These packages were not found in the license audit. Please review them
        manually.
      </Text>
      {Array.from(notFound).map(
        ([packageName, { packagePath, errorMessage }]) => {
          return (
            <NotFoundLicenseDetails
              key={packageName}
              packageName={packageName}
              packagePath={packagePath}
              errorMessage={errorMessage}
            />
          );
        },
      )}
    </Box>
  );
}
