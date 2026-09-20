import type { ColumnDef } from "@tanstack/react-table";

import { useAppTableHandlers } from "@/components/app/handlers";

import { AppCard } from "@/components/app/primitives/app-card";

import { AppDataTable } from "@/components/app/table/app-data-table";
import { AutorizacionPendienteListItem } from "@/Crm/features/desinstalaciones/auth/autorizaciones-desinstalacion.interfaces";

type AppTableController = ReturnType<typeof useAppTableHandlers>;

type AutorizacionesPendientesTableProps = {
  data: AutorizacionPendienteListItem[];

  columns: ColumnDef<AutorizacionPendienteListItem, any>[];

  totalRows: number;

  table: AppTableController;

  isLoading?: boolean;

  isFetching?: boolean;

  error?: unknown;

  onRetry?: () => void;
};

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export function AutorizacionesPendientesTable({
  data,
  columns,
  totalRows,
  table,
  isLoading = false,
  isFetching = false,
  error,
  onRetry,
}: AutorizacionesPendientesTableProps) {
  return (
    <AppCard variant="outline" size="xs" radius="md">
      <AppDataTable<AutorizacionPendienteListItem>
        data={data}
        columns={columns}
        getRowId={(row) => String(row.autorizacion.id)}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={onRetry}
        paginationMode="server"
        pagination={table.getPaginationConfig({
          totalRows,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
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
