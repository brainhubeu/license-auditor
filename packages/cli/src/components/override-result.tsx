import type { ConfigType, LicenseAuditResult } from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";
import { pluralize } from "../utils/pluralize.js";

export function OverrideResult({
  configOverrides,
  resultOverrides,
}: {
  configOverrides: Pick<ConfigType, "overrides">["overrides"];
  resultOverrides: Pick<LicenseAuditResult, "overrides">["overrides"];
}) {
  if (!configOverrides) {
    return null;
  }

  const overrideCount = Object.keys(configOverrides).length;

  if (!overrideCount) {
    return null;
  }

  const warns = Object.entries(configOverrides)
    .filter(([_packageName, severity]) => severity === "warn")
    .map(([packageName]) => packageName);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Box>
        <Text color="grey">{figures.warning} </Text>
        <Text>
          Skipped audit for {pluralize(overrideCount, "license", "licenses")}{" "}
          defined in the config file overrides field.
        </Text>
      </Box>
      {warns.length > 0 ? (
        <Box flexDirection="column" marginTop={1}>
          <Box>
            <Text color="grey">{figures.warning} </Text>
            <Text>Packages skipped with a warning:</Text>
          </Box>
          {warns.map((warnOverride) => (
            <Box key={warnOverride} marginLeft={2}>
              <Text>{figures.pointerSmall} </Text>
              <Text color="yellow">{warnOverride}</Text>
            </Box>
          ))}
        </Box>
      ) : null}
      {resultOverrides.notFoundOverrides.length > 0 ? (
        <Box flexDirection="column" marginTop={1}>
          <Box>
            <Text color="grey">{figures.warning} </Text>
            <Text>Packages listed in the overrides field but not found:</Text>
          </Box>
          {resultOverrides.notFoundOverrides.map((notFoundOverride) => (
            <Box key={notFoundOverride} marginLeft={2}>
              <Text color="gray">{figures.pointerSmall} </Text>
              <Text>{notFoundOverride}</Text>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
