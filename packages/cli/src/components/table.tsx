import { Box, Static, Text } from "ink";
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

  const tableContent = [
    <Text key="top-line">{topLine}</Text>,
    headerRow,
    <Text key="header-separator">{headerSeparator}</Text>,
    ...data.map((row, rowIndex) => (
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
    )),
    <Text key="bottom-line">{bottomLine}</Text>,
  ];

  // render entire table content at once with Static to prevent re-renders
  return <Static items={tableContent}>{(item) => item}</Static>;
}
