import { flexRender } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import cn from "@/lib/utils";

import type { RowData, Table as TableInterface } from "@tanstack/react-table";
import type { TableProps } from "@/components/ui/table";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: type signature must match TanStack Table's shape exactly, see https://tanstack.com/table/latest/docs/api/core/column-def#meta
  interface ColumnMeta<TData extends RowData, TValue> {
    tableCellClassName?: string;
    headerClassName?: string;
  }
}

interface Props<T> extends TableProps {
  table: TableInterface<T>;
}

/**
 * Data table.
 */
const DataTable = <T,>({ table, ...rest }: Props<T>) => (
  <Table {...rest}>
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="bg-primary/10">
          {headerGroup.headers.map((header) => (
            <TableCell
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              className={cn(
                "px-2 py-4",
                header.column.columnDef.meta?.tableCellClassName,
              )}
            >
              <div
                className={cn(
                  "w-full items-center justify-between gap-4 font-semibold",
                  header.column.columnDef.meta?.headerClassName,
                )}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableHeader>

    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className={cn(
                "px-2 py-4",
                cell.column.columnDef.meta?.tableCellClassName,
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

/** @knipignore */
export default DataTable;
