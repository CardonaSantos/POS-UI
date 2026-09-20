import { useMemo } from "react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataTable } from "@/components/app/table/app-data-table";
import type { useAppTableHandlers } from "@/components/app/handlers";
import { PerfilMobileCard } from "../cards/perfil-mobile-card";
import { PerfilHomologacionListItem } from "@/Crm/features/pppoe-homologaciones/intefaces";
import { createPerfilesTableColumns } from "./perfiles-table.columns";

type TableController = ReturnType<typeof useAppTableHandlers>;

interface PerfilesTableProps {
  items: PerfilHomologacionListItem[];
  totalRows: number;
  table: TableController;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  onRetry: () => void;
  onEdit: (item: PerfilHomologacionListItem) => void;
  onToggleStatus: (item: PerfilHomologacionListItem) => void;
}

export function PerfilesTable({
  items,
  totalRows,
  table,
  isLoading,
  isFetching,
  error,
  onRetry,
  onEdit,
  onToggleStatus,
}: PerfilesTableProps) {
  const columns = useMemo(
    () =>
      createPerfilesTableColumns({
        onEdit,
        onToggleStatus,
      }),
    [onEdit, onToggleStatus],
  );

  return (
    <AppCard variant="outline" size="xs" radius="md">
      <AppDataTable<PerfilHomologacionListItem>
        data={items}
        columns={columns}
        getRowId={(row) => String(row.id)}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={onRetry}
        variant="plain"
        responsiveMode="cards"
        renderMobileCard={(row) => (
          <PerfilMobileCard
            item={row.original}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
          />
        )}
        paginationMode="server"
        pagination={table.getPaginationConfig({
          totalRows,
          pageSizeOptions: [10, 20, 50],
        })}
        {...table.getDataTableStateProps()}
        enableSorting={false}
        enableVirtualization={false}
        enableColumnVisibility
        enableColumnPinning={false}
        stickyHeader
        density={table.density}
        maxHeight="70vh"
      />
    </AppCard>
  );
}
