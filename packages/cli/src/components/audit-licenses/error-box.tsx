import { Box, Text } from "ink";

export default function ErrorBox({
  color = "red",
  children,
}: {
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <Box borderStyle="single" borderColor={color}>
      <Text color={color}>{children}</Text>
    </Box>
  );
}
