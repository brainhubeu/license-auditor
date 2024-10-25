import figures from "figures";
import { Text } from "ink";
import React from "react";

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
