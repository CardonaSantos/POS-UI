"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { CircleUserRound, Clock, Map, Play, User } from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";
import { formattShortFecha } from "@/utils/formattFechas";

import type { RutaAsignadaRow } from "./rutas-asignadas.helpers";
import { getCobradorNombre } from "./rutas-asignadas.helpers";

interface CreateRutasAsignadasColumnsParams {
  onStart: (ruta: RutaAsignadaRow) => void;
}

function FechaCell({ ruta }: { ruta: RutaAsignadaRow }) {
  return (
    <AppInline align="center" gap="xs" className="min-w-0">
      <Clock
        size={13}
        className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
      />

      <span className="truncate text-xs tabular-nums text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {formattShortFecha(ruta.creadoEn)}
      </span>
    </AppInline>
  );
}

function RutaNameCell({ ruta }: { ruta: RutaAsignadaRow }) {
  return (
    <AppInline align="center" gap="xs" className="min-w-0">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
        <Map size={13} />
      </span>

      <div className="min-w-0">
        <p
          className="truncate text-xs font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]"
          title={ruta.nombreRuta}
        >
          {ruta.nombreRuta || "Sin nombre"}
        </p>

        <p className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          ID: {ruta.id}
        </p>
      </div>
    </AppInline>
  );
}

function CobradorCell({ ruta }: { ruta: RutaAsignadaRow }) {
  return (
    <AppInline align="center" gap="xs" className="min-w-0">
      <CircleUserRound
        size={13}
        className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
      />

      <span
        className="truncate text-xs text-[hsl(var(--app-foreground,var(--foreground)))]"
        title={getCobradorNombre(ruta)}
      >
        {ruta.cobrador?.nombre ?? "Sin cobrador"}
      </span>

      {ruta.cobrador?.rol ? (
        <AppBadge tone="neutral" appearance="soft" size="xs">
          {ruta.cobrador.rol}
        </AppBadge>
      ) : null}
    </AppInline>
  );
}

function ClientesCell({ ruta }: { ruta: RutaAsignadaRow }) {
  return (
    <AppBadge tone="info" appearance="soft" size="xs">
      <User size={12} />
      {ruta._count?.clientes ?? 0}
    </AppBadge>
  );
}

export function createRutasAsignadasColumns({
  onStart,
}: CreateRutasAsignadasColumnsParams): ColumnDef<RutaAsignadaRow, any>[] {
  return [
    {
      id: "creadoEn",
      header: "Fecha",
      size: 140,
      minSize: 120,
      cell: ({ row }) => <FechaCell ruta={row.original} />,
    },
    {
      accessorKey: "nombreRuta",
      header: "Ruta",
      size: 340,
      minSize: 240,
      meta: {
        grow: true,
      },
      cell: ({ row }) => <RutaNameCell ruta={row.original} />,
    },
    {
      id: "cobrador",
      header: "Cobrador",
      size: 240,
      minSize: 190,
      cell: ({ row }) => <CobradorCell ruta={row.original} />,
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
      cell: ({ row }) => <ClientesCell ruta={row.original} />,
    },
    createAppRowActionsColumn<RutaAsignadaRow>({
      header: "",
      size: 44,
      actions: (row) => [
        {
          label: "Iniciar ruta",
          icon: <Play size={13} />,
          onClick: () => onStart(row.original),
        },
      ],
    }),
  ];
}

export function RutaAsignadaMobileCard({
  ruta,
  onStart,
}: {
  ruta: RutaAsignadaRow;
  onStart: (ruta: RutaAsignadaRow) => void;
}) {
  return (
    <AppCard variant="outline" size="xs">
      <AppStack gap="sm">
        <AppInline align="start" justify="between" gap="sm">
          <RutaNameCell ruta={ruta} />
          <ClientesCell ruta={ruta} />
        </AppInline>

        <AppStack gap="xs">
          <FechaCell ruta={ruta} />
          <CobradorCell ruta={ruta} />
        </AppStack>

        <AppInline align="center" justify="end">
          <AppButton
            type="button"
            variant="primary"
            size="xs"
            width="auto"
            leftIcon={<Play size={12} />}
            onClick={() => onStart(ruta)}
          >
            Iniciar ruta
          </AppButton>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}
