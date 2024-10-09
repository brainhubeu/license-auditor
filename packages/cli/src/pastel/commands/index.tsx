import React from "react";
import { Text } from "ink";
import zod from "zod";

export const options = zod.object({
  name: zod.string().describe("Your name"),
});

type Props = {
  options: zod.infer<typeof options>;
};

export default function Index({ options }: Props) {
  return <Text>Hello, {options.name}!</Text>;
}
