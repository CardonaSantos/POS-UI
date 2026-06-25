"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Edit,
  Gauge,
  Trash2,
  Users,
  Wifi,
  XCircle,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataTable } from "@/components/app/table/app-data-table";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";
import { useAppTableHandlers } from "@/components/app/handlers";

import type {
  ServicioInternet,
  ServicioTableProps,
} from "./servicio-internet.types";

type AppBadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

function getEstadoServicioTone(estado?: string): AppBadgeTone {
  if (estado === "ACTIVO") return "success";
  if (estado === "INACTIVO") return "danger";

  return "neutral";
}

function EstadoServicioBadge({ estado }: { estado?: string }) {
  const isActivo = estado === "ACTIVO";

  return (
    <AppBadge
      tone={getEstadoServicioTone(estado)}
      appearance="soft"
      size="xs"
      radius="full"
    >
      {isActivo ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {estado ?? "SIN ESTADO"}
    </AppBadge>
  );
}

function ServicioNombreCell({ servicio }: { servicio: ServicioInternet }) {
  return (
    <AppInline align="center" gap="xs" className="min-w-0">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
        <Wifi size={13} />
      </span>

      <div className="min-w-0">
        <p
          className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]"
          title={servicio.nombre}
        >
          {servicio.nombre}
        </p>
        <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          ID: {servicio.id}
        </p>
      </div>
    </AppInline>
  );
}

function VelocidadCell({ velocidad }: { velocidad?: string | null }) {
  return (
    <AppInline align="center" gap="xs" className="min-w-0">
      <Gauge
        size={13}
        className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
      />

      <span
        className="truncate text-xs text-[hsl(var(--app-foreground,var(--foreground)))]"
        title={velocidad ?? undefined}
      >
        {velocidad || "No especificada"}
      </span>
    </AppInline>
  );
}

function ClientesCell({ count }: { count?: number | null }) {
  return (
    <AppInline align="center" justify="center" gap="xs">
      <AppBadge tone="info" appearance="soft" size="xs">
        <Users size={12} />
        {count ?? 0}
      </AppBadge>
    </AppInline>
  );
}

function ServicioMobileCard({
  servicio,
  formatearMoneda,
  onEditClick,
  onDeleteClick,
}: {
  servicio: ServicioInternet;
  formatearMoneda: (monto: number) => string;
  onEditClick: (servicio: ServicioInternet) => void;
  onDeleteClick: (id: number) => void;
}) {
  return (
    <AppCard variant="outline" size="xs">
      <AppStack gap="sm">
        <AppInline align="start" justify="between" gap="sm">
          <ServicioNombreCell servicio={servicio} />
          <EstadoServicioBadge estado={servicio.estado} />
        </AppInline>

        <AppInline align="center" justify="between" gap="sm">
          <VelocidadCell velocidad={servicio.velocidad} />

          <span className="shrink-0 text-xs font-semibold">
            {formatearMoneda(servicio.precio)}
          </span>
        </AppInline>

        <AppInline align="center" justify="between" gap="sm">
          <ClientesCell count={servicio.clientesCount} />

          <AppInline align="center" justify="end" gap="xs">
            <AppButton
              type="button"
              variant="secondary"
              size="xs"
              width="auto"
              leftIcon={<Edit size={12} />}
              onClick={() => onEditClick(servicio)}
            >
              Editar
            </AppButton>

            <AppButton
              type="button"
              variant="danger"
              size="xs"
              width="auto"
              leftIcon={<Trash2 size={12} />}
              onClick={() => onDeleteClick(servicio.id)}
            >
              Eliminar
            </AppButton>
          </AppInline>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}

export default function ServicioTable({
  servicios,
  formatearMoneda,
  onEditClick,
  onDeleteClick,
}: ServicioTableProps) {
  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialSorting: [{ id: "nombre", desc: false }],
  });

  console.log("Los servicios son: ", servicios);

  const columns = React.useMemo<ColumnDef<ServicioInternet, any>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Nombre",
        size: 300,
        minSize: 220,
        meta: {
          grow: true,
        },
        cell: ({ row }) => <ServicioNombreCell servicio={row.original} />,
      },
      {
        accessorKey: "velocidad",
        header: "Velocidad",
        size: 160,
        minSize: 130,
        maxSize: 190,
        cell: ({ row }) => <VelocidadCell velocidad={row.original.velocidad} />,
      },
      {
        accessorKey: "precio",
        header: "Precio",
        size: 120,
        minSize: 100,
        maxSize: 140,
        meta: {
          align: "right",
        },
        cell: ({ row }) => (
          <span className="text-xs font-semibold tabular-nums">
            {formatearMoneda(row.original.precio)}
          </span>
        ),
      },
      {
        accessorKey: "estado",
        header: "Estado",
        size: 120,
        minSize: 110,
        maxSize: 140,
        cell: ({ row }) => <EstadoServicioBadge estado={row.original.estado} />,
      },
      {
        accessorKey: "clientesCount",
        header: "Clientes",
        size: 90,
        minSize: 80,
        maxSize: 110,
        meta: {
          align: "center",
        },
        cell: ({ row }) => <ClientesCell count={row.original.clientesCount} />,
      },
      createAppRowActionsColumn<ServicioInternet>({
        header: "",
        size: 44,
        actions: (row) => [
          {
            label: "Editar",
            icon: <Edit size={13} />,
            onClick: () => onEditClick(row.original),
          },
          {
            label: "Eliminar",
            icon: <Trash2 size={13} />,
            tone: "danger",
            separatorBefore: true,
            onClick: () => onDeleteClick(row.original.id),
          },
        ],
      }),
    ],
    [formatearMoneda, onDeleteClick, onEditClick],
  );

  if (servicios.length === 0) {
    return (
      <AppEmptyState
        preset="empty"
        variant="plain"
        size="sm"
        align="center"
        icon={<Wifi size={34} strokeWidth={1.5} />}
        title="Sin planes"
        description="No hay planes de internet para mostrar."
        className="py-8"
      />
    );
  }

  return (
    <AppDataTable
      data={servicios}
      columns={columns}
      getRowId={(row) => String(row.id)}
      // density="xs"
      responsiveMode="cards"
      renderMobileCard={(row) => (
        <ServicioMobileCard
          servicio={row.original}
          formatearMoneda={formatearMoneda}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      )}
      paginationMode="client"
      pagination={table.getPaginationConfig({
        totalRows: servicios.length,
        pageSizeOptions: [10, 20, 50],
      })}
      maxHeight="520px"
      {...table.getDataTableStateProps()}
    />
  );
}
