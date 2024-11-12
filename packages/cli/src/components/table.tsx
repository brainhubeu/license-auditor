import { Box, Text } from "ink";
import { useMemo, type ReactNode } from "react";

export interface Column<T extends Record<string, string>> {
  title: string;
  accessor: keyof T;
  cell?: (rowData: T) => ReactNode;
}

interface TableProps<T extends Record<string, string>> {
  columns: Column<T>[];
  data: T[];
}

export function Table<T extends Record<string, string>>({
  columns,
  data,
}: TableProps<T>) {
  const columnsWithWidth = useMemo(() => {
    const columnsWithWidth = [];
    for (const column of columns) {
      const columnWidth = Math.max(
        ...data.map((row) => (row[column.accessor] ?? "").length),
        column.title.length,
      );
      columnsWithWidth.push({ ...column, width: columnWidth });
    }
    return columnsWithWidth;
  }, [columns, data]);

  // create a horizontal line
  const createHorizontalLine = (
    leftChar: string,
    midChar: string,
    rightChar: string,
  ) => {
    let line = leftChar;
    for (let i = 0; i < columnsWithWidth.length; i++) {
      line += "─".repeat((columnsWithWidth.at(i)?.width ?? 0) + 2); // +2 for padding
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

  // create header row
  const headerRow = (
    <Box flexDirection="row">
      <Text>│</Text>
      {columnsWithWidth.map((columnWithWidth) => {
        const content = columnWithWidth.title.padEnd(
          columnWithWidth.width,
          " ",
        );
        return (
          <Text key={columnWithWidth.title}>
            {" "}
            {content} {"│"}
          </Text>
        );
      })}
    </Box>
  );

  const dataRows = data.map((row, rowIndex) => (
    <Box key={Object.values(row).join(",")} flexDirection="row">
      <Text>│</Text>
      {columnsWithWidth.map((columnWithWidth, colIndex) => {
        const cellValue = row[columnWithWidth.accessor]?.toString() ?? "";
        const cellContent = columnWithWidth.cell ? (
          columnWithWidth.cell(row)
        ) : (
          <Text>{cellValue.padEnd(columnWithWidth.width, " ")}</Text>
        );
        return (
          <Text key={`${columnWithWidth.title}-${rowIndex}-${colIndex}`}>
            {" "}
            {cellContent} {"│"}
          </Text>
        );
      })}
    </Box>
  ));

  return (
    <Box flexDirection="column">
      <Text>{topLine}</Text>
      {headerRow}
      <Text>{headerSeparator}</Text>
      {dataRows}
      <Text>{bottomLine}</Text>
    </Box>
  );
}
