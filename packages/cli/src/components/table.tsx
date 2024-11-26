import { Box, Static, Text } from "ink";
import { type ReactNode, useMemo } from "react";
import { useTerminalDimensions } from "../hooks/use-terminal-dimensions.js";
import { calculateColumnWidths, splitIntoLines } from "../utils/table-utils.js";

export interface Column<T extends Record<string, string>> {
  title: string;
  accessor: keyof T;
  cell?: (value: string) => ReactNode; // This should not change length of the content in cell, only styling
}

interface TableProps<T extends Record<string, string>> {
  columns: Column<T>[];
  data: T[];
}

export function Table<T extends Record<string, string>>({
  columns,
  data,
}: TableProps<T>) {
  const [terminalWidth] = useTerminalDimensions();

  const availableSpace = terminalWidth - (3 * columns.length + 1);

  const columnsWithWidth = useMemo(
    () => calculateColumnWidths<T>(columns, data, availableSpace),
    [columns, data, availableSpace],
  );

  const createHorizontalLine = (
    leftChar: string,
    midChar: string,
    rightChar: string,
  ) => {
    let line = leftChar;
    for (let i = 0; i < columnsWithWidth.length; i++) {
      line += "─".repeat((columnsWithWidth[i]?.width ?? 0) + 2); // +2 for padding
      if (i < columns.length - 1) {
        line += midChar;
      }
    }
    line += rightChar;
    return line;
  };

  const topLine = createHorizontalLine("┌", "┬", "┐");
  const headerSeparator = createHorizontalLine("├", "┼", "┤");
  const bottomLine = createHorizontalLine("└", "┴", "┘");

  const headerRow = (
    <Box flexDirection="row" key="header-row">
      <Text>│</Text>
      {columnsWithWidth.map((columnWithWidth) => {
        const content = columnWithWidth.title;
        const padding = " ".repeat(columnWithWidth.width - content.length + 1);

        return (
          <Text key={columnWithWidth.title}>
            {" "}
            {content}
            {padding}
            {"│"}
          </Text>
        );
      })}
    </Box>
  );

  const tableContent = [
    <Text key="top-line">{topLine}</Text>,
    headerRow,
    <Text key="header-separator">{headerSeparator}</Text>,
    ...data.flatMap((row, rowIndex) => {
      const rowLines = columnsWithWidth.map((columnWithWidth) => {
        const cellValue = row[columnWithWidth.accessor]?.toString() ?? "";
        return splitIntoLines(cellValue, columnWithWidth.width);
      });

      const maxLines = rowLines.reduce(
        (max, lines) => Math.max(max, lines.length),
        0,
      );

      return Array.from({ length: maxLines }, (_, lineIndex) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: statically rendered component
        <Box key={`row-${rowIndex}-line-${lineIndex}`} flexDirection="row">
          <Text>│</Text>
          {columnsWithWidth.map((columnWithWidth, colIndex) => {
            const lines = rowLines[colIndex];
            const lineText = lines?.[lineIndex] || "";

            const cellContent = columnWithWidth.cell ? (
              columnWithWidth.cell(lineText)
            ) : (
              <Text>{lineText}</Text>
            );

            const padding = " ".repeat(
              columnWithWidth.width - lineText.length + 1,
            );

            return (
              <Text
                key={`${columnWithWidth.title}-${rowIndex}-${colIndex}-${lineIndex}`}
              >
                {" "}
                {cellContent}
                {padding}
                {"│"}
              </Text>
            );
          })}
        </Box>
      ));
    }),
    <Text key="bottom-line">{bottomLine}</Text>,
  ];

  // render entire table content at once with Static to prevent re-renders
  return <Static items={tableContent}>{(item) => item}</Static>;
}
