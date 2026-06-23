// components/facturacion-zona-table.tsx
"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Bell,
  CalendarDays,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Trash2,
  Users,
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

import type { FacturacionZona } from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";

interface FacturacionZonaTableProps {
  zonas: FacturacionZona[];
  onEdit: (zona: FacturacionZona) => void;
  onDelete: (zona: FacturacionZona) => void;
}

function DayChip({
  label,
  value,
  title,
}: {
  label: string;
  value: number | null | undefined;
  title: string;
}) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1 rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))] px-1.5 py-0.5 text-[10.5px] font-medium leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
    >
      {label}
      <span className="font-semibold tabular-nums text-[hsl(var(--app-foreground,var(--foreground)))]">
        {value ?? "—"}
      </span>
    </span>
  );
}

function FlagChip({
  active,
  label,
  title,
}: {
  active: boolean;
  label: string;
  title: string;
}) {
  return (
    <span
      title={title}
      aria-label={`${label}: ${active ? "activo" : "inactivo"}`}
      className="inline-flex items-center gap-1 rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border,var(--border)))] bg-[hsl(var(--app-muted,var(--muted)))] px-1.5 py-0.5 text-[10.5px] font-medium leading-none text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
    >
      <span
        className={
          active
            ? "h-1.5 w-1.5 rounded-full bg-[hsl(var(--app-success))]"
            : "h-1.5 w-1.5 rounded-full bg-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] opacity-40"
        }
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

function ZonaNameCell({ zona }: { zona: FacturacionZona }) {
  return (
    <AppInline align="center" gap="xs" className="min-w-0">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
        <CalendarDays size={13} />
      </span>

      <div className="min-w-0">
        <p
          className="truncate text-xs font-semibold leading-4 text-[hsl(var(--app-foreground,var(--foreground)))]"
          title={zona.nombre}
        >
          {zona.nombre || "Sin nombre"}
        </p>

        <p className="truncate text-[10px] leading-3 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          ID: {zona.id}
        </p>
      </div>
    </AppInline>
  );
}

function CicloCell({ zona }: { zona: FacturacionZona }) {
  return (
    <AppInline align="center" gap="xs" wrap>
      <DayChip
        label="Gen"
        value={zona.diaGeneracionFactura}
        title="Día de generación de factura"
      />
      <DayChip label="Pago" value={zona.diaPago} title="Día de pago" />
      <DayChip
        label="Rec1"
        value={zona.diaRecordatorio}
        title="Día del primer recordatorio"
      />
      <DayChip
        label="Rec2"
        value={zona.diaSegundoRecordatorio}
        title="Día del segundo recordatorio"
      />
      <DayChip label="Corte" value={zona.diaCorte} title="Día de corte" />
    </AppInline>
  );
}

function NotificacionesCell({ zona }: { zona: FacturacionZona }) {
  return (
    <AppInline align="center" gap="xs" wrap>
      <FlagChip
        active={Boolean(zona.enviarRecordatorioGeneracion)}
        label="Gen."
        title="Aviso de generación"
      />
      <FlagChip
        active={Boolean(zona.enviarRecordatorio1)}
        label="Rec1"
        title="Primer recordatorio"
      />
      <FlagChip
        active={Boolean(zona.enviarRecordatorio2)}
        label="Rec2"
        title="Segundo recordatorio"
      />
      <FlagChip
        active={Boolean(zona.enviarAvisoPago)}
        label="Pago"
        title="Aviso de pago"
      />
    </AppInline>
  );
}

function CountBadge({
  value,
  icon,
  tone = "info",
}: {
  value: number | null | undefined;
  icon: React.ReactNode;
  tone?: "info" | "neutral" | "primary" | "success" | "warning" | "danger";
}) {
  return (
    <AppBadge tone={tone} appearance="soft" size="xs">
      {icon}
      {value ?? 0}
    </AppBadge>
  );
}

function ZonaMobileCard({
  zona,
  onEdit,
  onDelete,
}: {
  zona: FacturacionZona;
  onEdit: (zona: FacturacionZona) => void;
  onDelete: (zona: FacturacionZona) => void;
}) {
  return (
    <AppCard variant="outline" size="xs">
      <AppStack gap="sm">
        <AppInline align="start" justify="between" gap="sm">
          <ZonaNameCell zona={zona} />

          <AppInline align="center" gap="xs">
            <CountBadge value={zona.clientesCount} icon={<Users size={12} />} />
            <CountBadge
              value={zona.facturasCount}
              icon={<FileText size={12} />}
              tone="neutral"
            />
          </AppInline>
        </AppInline>

        <AppStack gap="xs">
          <CicloCell zona={zona} />
          <NotificacionesCell zona={zona} />
        </AppStack>

        <AppInline align="center" justify="end" gap="xs">
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={<Edit size={12} />}
            onClick={() => onEdit(zona)}
          >
            Editar
          </AppButton>

          <AppButton
            type="button"
            variant="danger"
            size="xs"
            width="auto"
            leftIcon={<Trash2 size={12} />}
            onClick={() => onDelete(zona)}
          >
            Eliminar
          </AppButton>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}

export function FacturacionZonaTable({
  zonas,
  onEdit,
  onDelete,
}: FacturacionZonaTableProps) {
  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialDensity: "xs",
    initialSorting: [{ id: "nombre", desc: false }],
  });

  const columns = React.useMemo<ColumnDef<FacturacionZona, any>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Zona",
        size: 220,
        minSize: 180,
        cell: ({ row }) => <ZonaNameCell zona={row.original} />,
      },
      {
        id: "ciclo",
        header: "Días del ciclo",
        size: 360,
        minSize: 280,
        meta: {
          grow: true,
          truncate: false,
        },
        cell: ({ row }) => <CicloCell zona={row.original} />,
      },
      {
        id: "notificaciones",
        header: "Notificaciones",
        size: 330,
        minSize: 260,
        meta: {
          truncate: false,
        },
        cell: ({ row }) => <NotificacionesCell zona={row.original} />,
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
        cell: ({ row }) => (
          <CountBadge
            value={row.original.clientesCount}
            icon={<Users size={12} />}
          />
        ),
      },
      {
        accessorKey: "facturasCount",
        header: "Facturas",
        size: 90,
        minSize: 80,
        maxSize: 110,
        meta: {
          align: "center",
        },
        cell: ({ row }) => (
          <CountBadge
            value={row.original.facturasCount}
            icon={<FileText size={12} />}
            tone="neutral"
          />
        ),
      },
      createAppRowActionsColumn<FacturacionZona>({
        header: "",
        size: 44,
        actions: (row) => [
          {
            label: "Editar",
            icon: <Edit size={13} />,
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
    ],
    [onDelete, onEdit],
  );

  if (zonas.length === 0) {
    return (
      <AppEmptyState
        preset="empty"
        variant="plain"
        size="sm"
        align="center"
        icon={<CalendarDays size={34} strokeWidth={1.5} />}
        title="Sin zonas"
        description="No hay zonas de facturación para mostrar."
        className="py-8"
      />
    );
  }

  return (
    <AppDataTable
      data={zonas}
      columns={columns}
      getRowId={(row) => String(row.id)}
      responsiveMode="cards"
      renderMobileCard={(row) => (
        <ZonaMobileCard
          zona={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      paginationMode="client"
      pagination={table.getPaginationConfig({
        totalRows: zonas.length,
        pageSizeOptions: [10, 20, 50],
      })}
      enableVirtualization={false}
      {...table.getDataTableStateProps()}
    />
  );
}
