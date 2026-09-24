import type { ColumnDef } from "@tanstack/react-table";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataTable } from "@/components/app/table/app-data-table";
import type { useAppTableHandlers } from "@/components/app/handlers";
import type { TecnicoTrackingHistorialListItem } from "@/Crm/features/real-time-location/tracking.interfaces";

type TableController = ReturnType<typeof useAppTableHandlers>;

type TrackingHistoryTableProps = {
  data: TecnicoTrackingHistorialListItem[];
  columns: ColumnDef<TecnicoTrackingHistorialListItem, any>[];
  totalRows: number;
  table: TableController;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onRetry?: () => void;
};

export function TrackingHistoryTable({
  data,
  columns,
  totalRows,
  table,
  isLoading = false,
  isFetching = false,
  error,
  onRetry,
}: TrackingHistoryTableProps) {
  return (
    <AppCard variant="outline" size="xs" radius="md">
      <AppDataTable<TecnicoTrackingHistorialListItem>
        data={data}
        columns={columns}
        getRowId={(row) => String(row.asistenciaId)}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={onRetry}
        paginationMode="server"
        {...table.getDataTableStateProps()}
        pagination={table.getPaginationConfig({
          totalRows,
          pageSizeOptions: [10, 20, 50, 100],
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
