import { Text } from "ink";
import figures from "figures";

export function InfoText({ text }: { text: string }) {
  <Text color="grey">
    {figures.info} {text}
  </Text>;
}
