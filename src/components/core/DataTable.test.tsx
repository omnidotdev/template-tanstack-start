import { describe, expect, test } from "bun:test";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";

import DataTable from "./DataTable";

interface TestData {
  id: number;
  name: string;
  email: string;
}

const columnHelper = createColumnHelper<TestData>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
];

const testData: TestData[] = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

// Wrapper component that provides the table instance
const TestDataTable = ({ data = testData }: { data?: TestData[] }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable table={table} />;
};

describe("DataTable", () => {
  test("renders table headers", () => {
    render(<TestDataTable />);

    expect(screen.getByText("ID")).toBeDefined();
    expect(screen.getByText("Name")).toBeDefined();
    expect(screen.getByText("Email")).toBeDefined();
  });

  test("renders table data", () => {
    render(<TestDataTable />);

    expect(screen.getByText("John Doe")).toBeDefined();
    expect(screen.getByText("john@example.com")).toBeDefined();
    expect(screen.getByText("Jane Smith")).toBeDefined();
    expect(screen.getByText("jane@example.com")).toBeDefined();
  });

  test("renders correct number of rows", () => {
    render(<TestDataTable />);

    // Should have 2 data rows (not counting header)
    const rows = screen.getAllByRole("row");
    // 1 header row + 2 data rows = 3 total
    expect(rows.length).toBe(3);
  });

  test("handles empty data", () => {
    render(<TestDataTable data={[]} />);

    // Headers should still be present
    expect(screen.getByText("ID")).toBeDefined();
    expect(screen.getByText("Name")).toBeDefined();
    expect(screen.getByText("Email")).toBeDefined();

    // Only header row should exist
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(1);
  });
});
