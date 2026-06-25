"use client";

import * as React from "react";
import { MapPin } from "lucide-react";

import { AppDataTable } from "@/components/app/table/app-data-table";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { useAppTableHandlers } from "@/components/app/handlers";

import type {
  Municipio,
  Sector,
} from "../../features/cliente-interfaces/cliente-types";

import {
  createSectorTableColumns,
  SectorMobileCardContent,
} from "./sector-table.columns";

interface SectorTableProps {
  sectores: Sector[];
  municipios: Municipio[];
  onView: (sector: Sector) => void;
  onEdit: (sector: Sector) => void;
  onDelete: (sector: Sector) => void;
}

export function SectorTable({
  sectores,
  municipios,
  onView,
  onEdit,
  onDelete,
}: SectorTableProps) {
  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialDensity: "xs",
    initialSorting: [{ id: "creadoEn", desc: true }],
  });

  const columns = React.useMemo(
    () =>
      createSectorTableColumns({
        municipios,
        onView,
        onEdit,
        onDelete,
      }),
    [municipios, onView, onEdit, onDelete],
  );

  if (sectores.length === 0) {
    return (
      <AppEmptyState
        preset="empty"
        variant="plain"
        size="sm"
        align="center"
        icon={<MapPin size={34} strokeWidth={1.5} />}
        title="Sin sectores"
        description="No hay sectores para mostrar."
        className="py-8"
      />
    );
  }

  return (
    <AppDataTable<Sector>
      data={sectores}
      columns={columns}
      getRowId={(row) => String(row.id)}
      responsiveMode="cards"
      renderMobileCard={(row) => (
        <SectorMobileCardContent
          sector={row.original}
          municipios={municipios}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      paginationMode="client"
      pagination={table.getPaginationConfig({
        totalRows: sectores.length,
        pageSizeOptions: [5, 10, 20, 50],
      })}
      manualSorting={false}
      enableVirtualization={false}
      enableColumnVisibility
      {...table.getDataTableStateProps()}
    />
  );
}
