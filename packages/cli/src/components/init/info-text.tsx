import figures from "figures";
import { Text } from "ink";

export function InfoText({ text }: { text: string }) {
  <Text color="grey">
    {figures.info} {text}
  </Text>;
}
