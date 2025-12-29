"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, ChevronRight, Search } from "lucide-react";

import type {
  ClienteWhatsappServerListItem,
  PaginationMeta,
} from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";
import { clientesColumns } from "./columns";

type Props = {
  data: ClienteWhatsappServerListItem[];
  meta: PaginationMeta;

  isLoading?: boolean;
  isFetching?: boolean;

  nombre: string;
  onNombreChange: (value: string) => void;

  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function ClientesTableWhatsapp({
  data,
  meta,
  isLoading,
  isFetching,
  nombre,
  onNombreChange,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const columns = useMemo(() => clientesColumns, []);
  const pageIndex = Math.floor(meta.skip / meta.take);

  // TanStack states (controlados / manuales)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "nombre", value: nombre },
  ]);

  const pagination: PaginationState = useMemo(
    () => ({ pageIndex, pageSize: meta.take }),
    [pageIndex, meta.take]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      pagination,
    },
    pageCount: meta.totalPages,
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;

      // page size changed
      if (next.pageSize !== pagination.pageSize) {
        onPageSizeChange(next.pageSize);
        return;
      }

      // page index changed
      if (next.pageIndex !== pagination.pageIndex) {
        onPageChange(next.pageIndex);
      }
    },
    onColumnFiltersChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(columnFilters) : updater;
      setColumnFilters(next);

      const nombreValue = (next.find((f) => f.id === "nombre")?.value ??
        "") as string;

      onNombreChange(nombreValue);
    },
  });

  const showingFrom = meta.total === 0 ? 0 : meta.skip + 1;
  const showingTo = Math.min(meta.skip + meta.take, meta.total);

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2">
        <Users className="h-5 w-5 " />
        <h2 className="text-lg font-semibold">Clientes WhatsApp</h2>
        <span className="ml-auto text-xs text-muted-foreground">
          {meta.total} clientes
        </span>
      </div>

      {/* Toolbar (server filter) */}
      <div className="border-b bg-background p-3">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={nombre}
            onChange={(e) =>
              table.setColumnFilters([{ id: "nombre", value: e.target.value }])
            }
            placeholder="Buscar por nombre..."
            className="h-8 text-xs pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-background border-b">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left p-3 text-xs font-semibold text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="p-6 text-muted-foreground"
                  colSpan={columns.length}
                >
                  Cargando...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  className="p-6 text-muted-foreground"
                  colSpan={columns.length}
                >
                  No se encontraron clientes
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {isFetching && !isLoading && (
          <div className="p-2 text-xs text-muted-foreground">
            Actualizando...
          </div>
        )}
      </div>

      {/* Pagination (server) */}
      <div className="border-t bg-background p-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Mostrando {showingFrom}-{showingTo} de {meta.total}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!meta.hasPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-xs text-muted-foreground">
            {meta.page} / {meta.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!meta.hasNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
