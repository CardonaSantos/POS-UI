"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Coins,
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

import type { ServicioServiceManage, TipoServicio } from "../crm-service.types";
import { formatearMoneda } from "../crm-service.types";
import {
  getEstadoServicioTone,
  getTipoServicioNombre,
} from "./crm-service.helpers";

interface CrmServiceTableProps {
  data: ServicioServiceManage[];
  tiposServicio: TipoServicio[];
  isLoading?: boolean;
  onEdit: (servicio: ServicioServiceManage) => void;
  onDelete: (servicio: ServicioServiceManage) => void;
}

function ServicioNameCell({
  servicio,
  tiposServicio,
}: {
  servicio: ServicioServiceManage;
  tiposServicio: TipoServicio[];
}) {
  return (
    <AppInline align="center" gap="xs" className="min-w-0">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
        <FileText size={13} />
      </span>

      <div className="min-w-0">
        <p
          className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]"
          title={servicio.nombre}
        >
          {servicio.nombre || "Sin nombre"}
        </p>

        <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {getTipoServicioNombre(tiposServicio, servicio.tipoServicioId)}
        </p>

        {servicio.descripcion ? (
          <p
            className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            title={servicio.descripcion}
          >
            {servicio.descripcion}
          </p>
        ) : null}
      </div>
    </AppInline>
  );
}

function EstadoServicioBadge({ estado }: { estado?: string }) {
  const activo = estado === "ACTIVO";

  return (
    <AppBadge
      tone={getEstadoServicioTone(estado)}
      appearance="soft"
      size="xs"
      radius="full"
    >
      {activo ? <CheckCircle size={12} /> : <XCircle size={12} />}
      {estado ?? "SIN ESTADO"}
    </AppBadge>
  );
}

function PrecioCell({ precio }: { precio: number }) {
  return (
    <AppInline align="center" justify="end" gap="xs">
      <Coins
        size={13}
        className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
      />

      <span className="text-xs font-semibold tabular-nums">
        {formatearMoneda(precio)}
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
  tiposServicio,
  onEdit,
  onDelete,
}: {
  servicio: ServicioServiceManage;
  tiposServicio: TipoServicio[];
  onEdit: (servicio: ServicioServiceManage) => void;
  onDelete: (servicio: ServicioServiceManage) => void;
}) {
  return (
    <AppCard variant="outline" size="xs">
      <AppStack gap="sm">
        <AppInline align="start" justify="between" gap="sm">
          <ServicioNameCell servicio={servicio} tiposServicio={tiposServicio} />

          <EstadoServicioBadge estado={servicio.estado} />
        </AppInline>

        <AppInline align="center" justify="between" gap="sm">
          <PrecioCell precio={servicio.precio} />
          <ClientesCell count={servicio.clientesCount} />
        </AppInline>

        <AppInline align="center" justify="end" gap="xs">
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={<Edit size={12} />}
            onClick={() => onEdit(servicio)}
          >
            Editar
          </AppButton>

          <AppButton
            type="button"
            variant="danger"
            size="xs"
            width="auto"
            leftIcon={<Trash2 size={12} />}
            onClick={() => onDelete(servicio)}
          >
            Eliminar
          </AppButton>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}

export function CrmServiceTable({
  data,
  tiposServicio,
  isLoading,
  onEdit,
  onDelete,
}: CrmServiceTableProps) {
  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialSorting: [{ id: "nombre", desc: false }],
  });

  const columns = React.useMemo<ColumnDef<ServicioServiceManage, any>[]>(
    () => [
      {
        accessorKey: "nombre",
        header: "Servicio",
        size: 520,
        minSize: 320,
        meta: {
          grow: true,
        },
        cell: ({ row }) => (
          <ServicioNameCell
            servicio={row.original}
            tiposServicio={tiposServicio}
          />
        ),
      },
      {
        accessorKey: "precio",
        header: "Precio",
        size: 130,
        minSize: 110,
        maxSize: 150,
        meta: {
          align: "right",
        },
        cell: ({ row }) => <PrecioCell precio={row.original.precio} />,
      },
      {
        accessorKey: "estado",
        header: "Estado",
        size: 120,
        minSize: 110,
        maxSize: 140,
        meta: {
          align: "center",
        },
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
      createAppRowActionsColumn<ServicioServiceManage>({
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
    [onDelete, onEdit, tiposServicio],
  );

  if (!isLoading && data.length === 0) {
    return (
      <AppEmptyState
        preset="empty"
        variant="plain"
        size="sm"
        align="center"
        icon={<FileText size={34} strokeWidth={1.5} />}
        title="Sin servicios"
        description="No hay servicios registrados para mostrar."
        className="py-8"
      />
    );
  }

  return (
    <AppDataTable
      data={data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={isLoading}
      responsiveMode="cards"
      renderMobileCard={(row) => (
        <ServicioMobileCard
          servicio={row.original}
          tiposServicio={tiposServicio}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      paginationMode="client"
      pagination={table.getPaginationConfig({
        totalRows: data.length,
        pageSizeOptions: [10, 20, 50],
      })}
      enableVirtualization={false}
      {...table.getDataTableStateProps()}
    />
  );
}
