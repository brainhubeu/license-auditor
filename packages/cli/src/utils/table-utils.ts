import type { Column } from "../components/table.js";

const getContentWidth = <T extends Record<string, string>>(
  column: Column<T>,
  data: T[],
) => {
  if (data.length === 0) {
    return 0;
  }
  return Math.max(...data.map((row) => (row[column.accessor] ?? "").length));
};

const getTitleWidth = <T extends Record<string, string>>(column: Column<T>) =>
  column.title.length;

const calculateInitialColumnWidth = <T extends Record<string, string>>(
  column: Column<T>,
  data: T[],
) => Math.max(getContentWidth(column, data), getTitleWidth(column));

const isMaximallyShrunk = <T extends Record<string, string>>(
  column: Column<T> & { width: number; titleWidth: number },
) => column.width === column.titleWidth;

const allColumnsShrinked = <T extends Record<string, string>>(
  columns: (Column<T> & {
    width: number;
    contentWidth: number;
    titleWidth: number;
  })[],
) => {
  return columns.every(isMaximallyShrunk);
};

const findWidestColumnUnshrinked = <T extends Record<string, string>>(
  columns: (Column<T> & {
    width: number;
    contentWidth: number;
    titleWidth: number;
  })[],
) => {
  const unshrinkedColumns = columns
    .map((column, index) => ({
      column,
      index,
    }))
    .filter(({ column }) => !isMaximallyShrunk(column));

  if (!unshrinkedColumns[0]) {
    return null;
  }

  return unshrinkedColumns.reduce(
    (acc, { column, index }) =>
      column.width > (acc.column?.width ?? 0) ? { column, index } : acc,
    { column: unshrinkedColumns[0].column, index: 0 },
  );
};

const shrinkColumns = <T extends Record<string, string>>(
  columns: (Column<T> & {
    width: number;
    contentWidth: number;
    titleWidth: number;
  })[],
  availableSpace: number,
) => {
  const totalColumnWidth = columns.reduce(
    (acc, column) => acc + column.width,
    0,
  );

  if (totalColumnWidth <= availableSpace || allColumnsShrinked(columns)) {
    return columns;
  }

  const widestColumnResult = findWidestColumnUnshrinked(columns);
  if (!widestColumnResult) {
    return columns;
  }

  const { column: widestColumn, index } = widestColumnResult;

  const restColumnsWidth = totalColumnWidth - widestColumn.width;
  const remainingSpace = availableSpace - restColumnsWidth;

  const newWidth = (() => {
    if (remainingSpace > 0 && widestColumn.titleWidth < remainingSpace) {
      return remainingSpace;
    }
    return widestColumn.titleWidth;
  })();

  return shrinkColumns(
    [
      ...columns.slice(0, index),
      {
        ...widestColumn,
        width: newWidth,
      },
      ...columns.slice(index + 1),
    ],
    availableSpace,
  );
};

export const calculateColumnWidths = <T extends Record<string, string>>(
  columns: Column<T>[],
  data: T[],
  availableSpace: number,
): (Column<T> & { width: number })[] => {
  const initialColumnWidths = columns.map((column) => ({
    ...column,
    contentWidth: getContentWidth(column, data),
    titleWidth: getTitleWidth(column),
    width: calculateInitialColumnWidth(column, data),
  }));

  return shrinkColumns(initialColumnWidths, availableSpace);
};

export function splitIntoLines(text: string, width: number): string[] {
  const lines: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    if (startIndex + width >= text.length) {
      lines.push(text.substring(startIndex));
      break;
    }

    const endIndex = startIndex + width;
    const lastSpace = text.lastIndexOf(" ", endIndex);

    if (lastSpace > startIndex) {
      lines.push(text.substring(startIndex, lastSpace));
      startIndex = lastSpace + 1;
    } else {
      lines.push(text.substring(startIndex, endIndex));
      startIndex = endIndex;
    }
  }

  return lines;
}
