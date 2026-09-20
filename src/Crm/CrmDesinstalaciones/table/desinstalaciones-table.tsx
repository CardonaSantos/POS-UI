import type { ColumnDef } from "@tanstack/react-table";

import { AppCard } from "@/components/app/primitives/app-card";

import { AppDataTable } from "@/components/app/table/app-data-table";

import type { useAppTableHandlers } from "@/components/app/handlers";

import type { ClienteDesinstalacionListItem } from "@/Crm/features/desinstalaciones/desinstalaciones.interfaces";

type DesinstalacionesTableController = ReturnType<typeof useAppTableHandlers>;

type DesinstalacionesTableProps = {
  data: ClienteDesinstalacionListItem[];

  columns: ColumnDef<ClienteDesinstalacionListItem, any>[];

  totalRows: number;

  table: DesinstalacionesTableController;

  isLoading?: boolean;

  isFetching?: boolean;

  error?: unknown;

  onRetry?: () => void;
};

export function DesinstalacionesTable({
  data,

  columns,

  totalRows,

  table,

  isLoading = false,

  isFetching = false,

  error,

  onRetry,
}: DesinstalacionesTableProps) {
  return (
    <AppCard variant="outline" size="xs" radius="md">
      <AppDataTable<ClienteDesinstalacionListItem>
        data={data}
        columns={columns}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={onRetry}
        paginationMode="server"
        {...table.getDataTableStateProps()}
        pagination={table.getPaginationConfig({
          totalRows,

          pageSizeOptions: [10, 20, 50],
        })}
        enableColumnVisibility
        enableColumnPinning
        stickyHeader
        density={table.density}
        maxHeight="70vh"
      />
    </AppCard>
  );
}
