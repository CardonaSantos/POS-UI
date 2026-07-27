import type { ColumnDef } from "@tanstack/react-table";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataTable } from "@/components/app/table/app-data-table";

import type { ClienteInstalacionListItem } from "@/Crm/features/instalaciones/instalaciones.interfaces";

import type { useAppTableHandlers } from "@/components/app/handlers";

type InstalacionesTableController = ReturnType<typeof useAppTableHandlers>;

type InstalacionesTableProps = {
  data: ClienteInstalacionListItem[];

  columns: ColumnDef<ClienteInstalacionListItem, any>[];

  totalRows: number;

  table: InstalacionesTableController;

  isLoading?: boolean;
  isFetching?: boolean;

  error?: unknown;

  onRetry?: () => void;
};

export function InstalacionesTable({
  data,
  columns,
  totalRows,
  table,

  isLoading = false,
  isFetching = false,

  error,
  onRetry,
}: InstalacionesTableProps) {
  return (
    <AppCard variant="outline" size="xs" radius="md">
      <AppDataTable<ClienteInstalacionListItem>
        data={data}
        columns={columns}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={onRetry}
        paginationMode="server"
        pagination={table.getPaginationConfig({
          totalRows,
          pageSizeOptions: [10, 20, 50],
        })}
        {...table.getDataTableStateProps()}
        enableColumnVisibility
        enableColumnPinning
        stickyHeader
        density={table.density}
        maxHeight="70vh"
      />
    </AppCard>
  );
}
