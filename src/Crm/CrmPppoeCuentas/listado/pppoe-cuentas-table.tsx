import type { ColumnDef } from "@tanstack/react-table";

import { AppCard } from "@/components/app/primitives/app-card";

import { AppDataTable } from "@/components/app/table/app-data-table";

import type { useAppTableHandlers } from "@/components/app/handlers";

import type { PppoeCuentaListItem } from "@/Crm/features/pppoe-cuentas/pppoe-cuentas.interfaces";

type PppoeCuentasTableController = ReturnType<typeof useAppTableHandlers>;

type PppoeCuentasTableProps = {
  data: PppoeCuentaListItem[];

  columns: ColumnDef<PppoeCuentaListItem, any>[];

  totalRows: number;

  table: PppoeCuentasTableController;

  isLoading?: boolean;

  isFetching?: boolean;

  error?: unknown;

  onRetry?: () => void;

  onViewCuenta: (cuentaPppoeId: number) => void;
};

export function PppoeCuentasTable({
  data,
  columns,
  totalRows,
  table,

  isLoading = false,
  isFetching = false,

  error,
  onRetry,

  onViewCuenta,
}: PppoeCuentasTableProps) {
  return (
    <AppCard variant="outline" size="xs" radius="md">
      <AppDataTable<PppoeCuentaListItem>
        data={data}
        columns={columns}
        getRowId={(row) => String(row.cuentaPppoeId)}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={onRetry}
        emptyTitle="Sin cuentas PPPoE"
        emptyDescription="No existen cuentas PPPoE que coincidan con los criterios actuales."
        paginationMode="server"
        {...table.getDataTableStateProps()}
        pagination={table.getPaginationConfig({
          totalRows,
          pageSizeOptions: [10, 20, 50],
        })}
        enableColumnVisibility
        enableColumnPinning
        stickyHeader
        hoverable
        density={table.density}
        maxHeight="70vh"
        onRowClick={(row) => onViewCuenta(row.original.cuentaPppoeId)}
      />
    </AppCard>
  );
}
