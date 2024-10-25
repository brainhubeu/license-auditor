import figures from "figures";
import { Box, Text } from "ink";
import React from "react";

export default function NotFoundResult({
  notFound,
}: {
  notFound: Map<string, { packagePath: string }>;
}) {
  const describePackagesCount =
    notFound.size === 1 ? "package is" : "packages are";

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="yellow">{figures.warning}</Text>
        <Text>
          {notFound.size} {describePackagesCount} missing license information:
        </Text>
      </Box>
      <Box flexDirection="column" marginLeft={2}>
        {Array.from(notFound).map(([packageName, { packagePath }]) => (
          <Box key={packagePath}>
            <Text color="gray">{figures.pointerSmall}</Text>
            <Text>
              {" "}
              {packageName}: {packagePath}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
