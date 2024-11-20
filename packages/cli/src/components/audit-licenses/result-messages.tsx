import type { LicenseAuditResult } from "@license-auditor/data";
import figures from "figures";
import { Box, Text } from "ink";

function describeLicenseCount(
  count: number,
  singular: string,
  plural: string,
): string {
  const phrase = count === 1 ? singular : plural;
  return `${count} ${phrase}`;
}

interface MessageProps {
  count: number;
}

export function CompliantMessage({ count }: MessageProps) {
  return (
    <>
      <Text color="green">{figures.tick}</Text>
      <Text>
        {describeLicenseCount(count, "license is", "licenses are")} compliant
      </Text>
    </>
  );
}

export function BlacklistedMessage({ count }: MessageProps) {
  return (
    <>
      <Text color="red">{figures.cross}</Text>
      <Text>
        {describeLicenseCount(count, "license is", "licenses are")} blacklisted:
      </Text>
    </>
  );
}

export function UnknownMessage({ count }: MessageProps) {
  return (
    <>
      <Text color="yellow">{figures.warning}</Text>
      <Text>
        {describeLicenseCount(count, "license is", "licenses are")} unknown:
      </Text>
    </>
  );
}

export function OverrideMessage({
  overrides,
}: Pick<LicenseAuditResult, "overrides">) {
  const overrideCount =
    overrides.excluded.length + Object.keys(overrides.assigned).length;
  if (!overrideCount) {
    return null;
  }

  return (
    <Box flexDirection="column">
      <Box>
        <Text color="grey">{figures.warning} </Text>
        <Text>
          Skipped audit for{" "}
          {describeLicenseCount(overrideCount, "license", "licenses")} defined
          in the config file overrides field.
        </Text>
      </Box>
      {overrides.extraOverrides.length > 0 ? (
        <Box flexDirection="column">
          <Box>
            <Text color="grey">{figures.warning} </Text>
            <Text>
              Following packages listed in the overrides field weren't found:
            </Text>
          </Box>
          {overrides.extraOverrides.map((extraOverride) => (
            <Box key={extraOverride} marginLeft={2}>
              <Text color="gray">{figures.pointerSmall} </Text>
              <Text>{extraOverride}</Text>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

export function SuccessHeaderMessage() {
  return (
    <Text backgroundColor="green" color="black" bold>
      {` ${figures.tick} LICENSE AUDIT SUCCEEDED `}
    </Text>
  );
}

export function FailureHeaderMessage() {
  return (
    <Text backgroundColor="red" color="white" bold>
      {` ${figures.cross} LICENSE AUDIT FAILED `}
    </Text>
  );
}

export function WarningHeaderMessage() {
  return (
    <Text backgroundColor="yellow" color="black" bold>
      {` ${figures.warning} LICENSE AUDIT WARNING `}
    </Text>
  );
}
