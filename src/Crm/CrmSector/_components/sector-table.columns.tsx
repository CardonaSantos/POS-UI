"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Edit, Eye, Trash2, Users } from "lucide-react";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";
import type {
  Municipio,
  Sector,
} from "../../features/cliente-interfaces/cliente-types";
import { formattShortFecha } from "@/utils/formattFechas";

interface CreateSectorColumnsParams {
  municipios: Municipio[];
  onView: (sector: Sector) => void;
  onEdit: (sector: Sector) => void;
  onDelete: (sector: Sector) => void;
}

function getMunicipioNombre(sector: Sector, municipios: Municipio[]) {
  if (sector.municipio?.nombre) return sector.municipio.nombre;

  return (
    municipios.find((municipio) => municipio.id === sector.municipioId)
      ?.nombre ?? "Sin municipio"
  );
}

function SectorNameCell({ sector }: { sector: Sector }) {
  return (
    <AppInline align="center" gap="xs" className="min-w-0">
      <div className="min-w-0">
        <p
          className="truncate text-xs font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]"
          title={sector.nombre}
        >
          {sector.nombre || "Sin nombre"}
        </p>

        <p className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          ID: {sector.id}
        </p>
      </div>
    </AppInline>
  );
}

function DescriptionCell({ sector }: { sector: Sector }) {
  return (
    <AppInline align="center" gap="xs" className="min-w-0">
      <span
        className="truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
        title={sector.descripcion ?? ""}
      >
        {sector.descripcion || "Sin descripción"}
      </span>
    </AppInline>
  );
}

function MunicipioCell({
  sector,
  municipios,
}: {
  sector: Sector;
  municipios: Municipio[];
}) {
  return (
    <AppBadge tone="neutral" appearance="soft" size="xs">
      {getMunicipioNombre(sector, municipios)}
    </AppBadge>
  );
}

function ClientesCell({ sector }: { sector: Sector }) {
  const count = sector.clientes?.length ?? 0;

  return (
    <AppBadge tone="info" appearance="soft" size="xs">
      <Users size={12} />
      {count}
    </AppBadge>
  );
}

function FechaCell({ sector }: { sector: Sector }) {
  return (
    <AppInline align="center" justify="end" gap="xs">
      <CalendarDays
        size={13}
        className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
      />

      <span className="text-xs tabular-nums text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {formattShortFecha(sector.creadoEn)}
      </span>
    </AppInline>
  );
}

export function createSectorTableColumns({
  municipios,
  onView,
  onEdit,
  onDelete,
}: CreateSectorColumnsParams): ColumnDef<Sector, any>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Sector",
      size: 240,
      minSize: 200,
      cell: ({ row }) => <SectorNameCell sector={row.original} />,
    },
    {
      id: "descripcion",
      header: "Descripción",
      size: 320,
      minSize: 240,
      meta: {
        grow: true,
      },
      cell: ({ row }) => <DescriptionCell sector={row.original} />,
    },
    {
      id: "municipio",
      header: "Municipio",
      size: 180,
      minSize: 150,
      cell: ({ row }) => (
        <MunicipioCell sector={row.original} municipios={municipios} />
      ),
    },
    {
      id: "clientes",
      header: "Clientes",
      size: 100,
      minSize: 90,
      maxSize: 120,
      meta: {
        align: "center",
      },
      cell: ({ row }) => <ClientesCell sector={row.original} />,
    },
    {
      id: "creadoEn",
      header: "Creado",
      size: 120,
      minSize: 110,
      maxSize: 140,
      meta: {
        align: "right",
      },
      cell: ({ row }) => <FechaCell sector={row.original} />,
    },
    createAppRowActionsColumn<Sector>({
      header: "",
      size: 44,
      actions: (row) => [
        {
          label: "Ver detalles",
          icon: <Eye size={13} />,
          onClick: () => onView(row.original),
        },
        {
          label: "Editar",
          icon: <Edit size={13} />,
          separatorBefore: true,
          onClick: () => onEdit(row.original),
        },
        {
          label: "Eliminar",
          icon: <Trash2 size={13} />,
          tone: "danger",
          separatorBefore: true,
          onClick: () => onDelete(row.original),
        },
      ],
    }),
  ];
}

export function SectorMobileCardContent({
  sector,
  municipios,
  onView,
  onEdit,
  onDelete,
}: {
  sector: Sector;
  municipios: Municipio[];
  onView: (sector: Sector) => void;
  onEdit: (sector: Sector) => void;
  onDelete: (sector: Sector) => void;
}) {
  return (
    <AppStack gap="sm">
      <AppInline align="start" justify="between" gap="sm">
        <SectorNameCell sector={sector} />
        <ClientesCell sector={sector} />
      </AppInline>

      <AppStack gap="xs">
        <DescriptionCell sector={sector} />
        <MunicipioCell sector={sector} municipios={municipios} />
        <FechaCell sector={sector} />
      </AppStack>

      <AppInline align="center" justify="end" gap="xs">
        <button
          type="button"
          className="text-xs font-medium text-[hsl(var(--app-primary))] hover:underline"
          onClick={() => onView(sector)}
        >
          Ver
        </button>

        <button
          type="button"
          className="text-xs font-medium text-[hsl(var(--app-primary))] hover:underline"
          onClick={() => onEdit(sector)}
        >
          Editar
        </button>

        <button
          type="button"
          className="text-xs font-medium text-[hsl(var(--app-danger,var(--destructive)))] hover:underline"
          onClick={() => onDelete(sector)}
        >
          Eliminar
        </button>
      </AppInline>
    </AppStack>
  );
}
