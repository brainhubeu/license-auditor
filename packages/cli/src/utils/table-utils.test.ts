import { describe, expect, it } from "vitest";
import type { Column } from "../components/table.js";
import { calculateColumnWidths, splitIntoLines } from "./table-utils.js";

describe("table-utils", () => {
  describe("calculateColumnWidths", () => {
    it("should calculate the correct widths for simple input", () => {
      const columns: Column<{ name: string; age: string }>[] = [
        { title: "Name", accessor: "name" },
        { title: "Age", accessor: "age" },
      ];
      const data = [
        { name: "Alice", age: "30" },
        { name: "Bob", age: "25" },
      ];
      const availableSpace = 20;

      const expected = [
        { ...columns[0], width: 5, contentWidth: 5, titleWidth: 4 },
        { ...columns[1], width: 3, contentWidth: 2, titleWidth: 3 },
      ];

      const result = calculateColumnWidths(columns, data, availableSpace);

      expect(result).toEqual(expected);
    });

    it("should handle empty data", () => {
      const columns: Column<{ name: string; age: string }>[] = [
        { title: "Name", accessor: "name" },
        { title: "Age", accessor: "age" },
      ];
      const data: [] = [];
      const availableSpace = 20;

      const expected = [
        { ...columns[0], width: 4, contentWidth: 0, titleWidth: 4 },
        { ...columns[1], width: 3, contentWidth: 0, titleWidth: 3 },
      ];

      const result = calculateColumnWidths(columns, data, availableSpace);

      expect(result).toEqual(expected);
    });

    it("should shrink columns correctly when total width exceeds terminal width", () => {
      const columns: Column<{ id: string; username: string; email: string }>[] =
        [
          { title: "ID", accessor: "id" },
          { title: "Username", accessor: "username" },
          { title: "Email", accessor: "email" },
        ];
      const data = [
        { id: "1", username: "johnsmith", email: "john@example.com" },
        { id: "2", username: "janedoe", email: "jane@example.com" },
      ];
      const availableSpace = 20;

      const result = calculateColumnWidths(columns, data, availableSpace);

      const totalWidth = result.reduce((acc, column) => acc + column.width, 0);
      expect(totalWidth).toBeLessThanOrEqual(availableSpace);

      expect(result[0]?.width).toBe(2); // same as "ID".length
      expect(result[1]?.width).toBe(9); // same as "johnsmith".length
      expect(result[2]?.width).toBe(9); // fill remaining space
    });
  });

  describe("splitIntoLines", () => {
    it("handles empty string", () => {
      expect(splitIntoLines("", 10)).toEqual([]);
    });

    it("handles string shorter than width", () => {
      const text = "Hello";
      expect(splitIntoLines(text, 10)).toEqual([text]);
    });

    it("splits string at exact width when no spaces near boundary", () => {
      const text = "HelloWorld";
      expect(splitIntoLines(text, 5)).toEqual(["Hello", "World"]);
    });

    it("splits string without cutting words", () => {
      const text = "Hello beautiful world";
      expect(splitIntoLines(text, 10)).toEqual(["Hello", "beautiful", "world"]);
    });

    it("handles string where width ends at a space", () => {
      const text = "Hello beautiful world";
      expect(splitIntoLines(text, 16)).toEqual(["Hello beautiful", "world"]);
    });

    it("cuts to width when no spaces are found", () => {
      const text = "HelloBeautifulWorld";
      expect(splitIntoLines(text, 10)).toEqual(["HelloBeaut", "ifulWorld"]);
    });
  });
});
