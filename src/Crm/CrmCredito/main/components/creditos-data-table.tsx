"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { creditosColumns } from "./creditos-table-columns";
import { CreditosPagination } from "./creditos-pagination";
import {
  CreditoResponse,
  PaginationMeta,
} from "@/Crm/features/credito/credito-interfaces";

interface CreditosDataTableProps {
  data: CreditoResponse[];
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function CreditosDataTable({
  data,
  meta,
  currentPage,
  onPageChange,
  isLoading,
}: CreditosDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: creditosColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    manualPagination: true,
    pageCount: meta.lastPage,
  });

  return (
    <div className="space-y-2">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs h-8 px-2"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={creditosColumns.length}
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  Cargando...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-1.5 px-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={creditosColumns.length}
                  className="h-20 text-center text-sm text-muted-foreground"
                >
                  No se encontraron créditos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CreditosPagination
        currentPage={currentPage}
        totalPages={meta.lastPage}
        totalItems={meta.total}
        onPageChange={onPageChange}
      />
    </div>
  );
}
