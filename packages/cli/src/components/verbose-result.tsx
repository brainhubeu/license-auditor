import Table from "ink-table";

const tableData = [
  { name: "John", age: 30, city: "New York" },
  { name: "Jane", age: 25, city: "Los Angeles" },
];

export default function VerboseResult() {
  return <Table.default data={tableData} />;
}
