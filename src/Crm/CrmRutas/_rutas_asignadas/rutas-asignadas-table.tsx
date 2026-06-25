"use client";

import * as React from "react";
import { Map } from "lucide-react";

import { AppDataTable } from "@/components/app/table/app-data-table";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { useAppTableHandlers } from "@/components/app/handlers";

import type { RutaAsignadaRow } from "./rutas-asignadas.helpers";
import {
  createRutasAsignadasColumns,
  RutaAsignadaMobileCard,
} from "./rutas-asignadas.columns";

interface RutasAsignadasTableProps {
  rutas: RutaAsignadaRow[];
  isLoading?: boolean;
  isFetching?: boolean;
  onStart: (ruta: RutaAsignadaRow) => void;
}

export function RutasAsignadasTable({
  rutas,
  isLoading,
  isFetching,
  onStart,
}: RutasAsignadasTableProps) {
  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialDensity: "xs",
    initialSorting: [{ id: "creadoEn", desc: true }],
  });

  const columns = React.useMemo(
    () =>
      createRutasAsignadasColumns({
        onStart,
      }),
    [onStart],
  );

  if (!isLoading && rutas.length === 0) {
    return (
      <AppEmptyState
        preset="empty"
        variant="plain"
        size="sm"
        align="center"
        icon={<Map size={34} strokeWidth={1.5} />}
        title="Sin rutas asignadas"
        description="Aún no tienes rutas asignadas. Cuando te asignen una, aparecerá aquí."
        className="py-10"
      />
    );
  }

  return (
    <AppDataTable<RutaAsignadaRow>
      data={rutas}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={isLoading}
      isFetching={isFetching}
      responsiveMode="cards"
      renderMobileCard={(row) => (
        <RutaAsignadaMobileCard ruta={row.original} onStart={onStart} />
      )}
      paginationMode="client"
      pagination={table.getPaginationConfig({
        totalRows: rutas.length,
        pageSizeOptions: [10, 20, 50],
      })}
      manualSorting={false}
      enableVirtualization={false}
      enableColumnVisibility
      {...table.getDataTableStateProps()}
    />
  );
}
