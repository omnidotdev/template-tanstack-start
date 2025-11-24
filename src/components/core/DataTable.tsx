import { flexRender } from "@tanstack/react-table";

import { Table, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { RowData, Table as TableInterface } from "@tanstack/react-table";
import type { TableProps } from "@/components/ui/table";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    tableCellClassName?: string;
    headerClassName?: string;
  }
}

interface Props<T> extends TableProps {
  table: TableInterface<T>;
}

export const DataTable = <T,>({ table, ...rest }: Props<T>) => (
  <Table {...rest}>
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
              {flexRender(header.column.columnDef.header, header.getContext())}

              {/* {header.column.getCanSort() && */}
              {/* 	({ */}
              {/* 		asc: <Icon src={LuArrowUpNarrowWide} size="sm" />, */}
              {/* 		desc: <Icon src={LuArrowDownWideNarrow} size="sm" />, */}
              {/* 		false: <Icon src={LuChevronsUpDown} size="sm" />, */}
              {/* 	}[header.column.getIsSorted() as string] ?? */}
              {/* 		null)} */}
            </div>
          </TableCell>
        ))}
      </TableRow>
    ))}
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
  </Table>
);
