import { Text } from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { type Column, Table } from "./table.js";

type RowData = {
  name: string;
  description: string;
  age: string;
};

vi.mock("../hooks/use-terminal-dimensions.js", async () => {
  const actual = await vi.importActual("../hooks/use-terminal-dimensions.js");
  return {
    ...actual,
    useTerminalDimensions: vi.fn(),
  };
});

describe("Table Component with mocked terminal dimensions", () => {
  const columns: Column<RowData>[] = [
    { title: "Name", accessor: "name" },
    {
      title: "Description",
      accessor: "description",
      cell: (content) => <Text color="red">{content}</Text>,
    },
    { title: "Age", accessor: "age" },
  ];

  const data: RowData[] = [
    {
      name: "Alice",
      description:
        "Develops and maintains software, writes code, tests new features, and fixes bugs.",
      age: "20",
    },
    {
      name: "Bob",
      description:
        "Creates robust applications by programming, testing, and deploying software solutions.",
      age: "30",
    },
    {
      name: "Charlie",
      description:
        "Responsible for designing and implementing user interfaces, ensuring a seamless user experience.",
      age: "27",
    },
  ];

  it("renders the table with sufficient terminal width", async () => {
    const { useTerminalDimensions } = await import(
      "../hooks/use-terminal-dimensions.js"
    );
    // @ts-expect-error
    useTerminalDimensions.mockReturnValue([350, 20]);

    const { lastFrame } = render(<Table columns={columns} data={data} />);
    const output = lastFrame();

    expect(output).toMatchSnapshot();
  });

  it("renders the table with insufficient terminal width", async () => {
    const { useTerminalDimensions } = await import(
      "../hooks/use-terminal-dimensions.js"
    );
    // @ts-expect-error
    useTerminalDimensions.mockReturnValue([50, 20]);

    const { lastFrame } = render(<Table columns={columns} data={data} />);
    const output = lastFrame();

    expect(output).toMatchSnapshot();
  });
});
