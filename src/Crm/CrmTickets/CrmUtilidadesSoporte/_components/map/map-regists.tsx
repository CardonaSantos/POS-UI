"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Activity,
  CheckCircle2,
  FileText,
  SquarePen,
  Ticket,
  Trash2,
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

import type { SolucionTicketItem } from "@/Crm/features/ticket-soluciones/ticket-soluciones.interface";
import {
  getSolucionEstadoLabel,
  getSolucionEstadoTone,
  getSolucionTicketCount,
} from "../ticket-soluciones.helpers";

interface TicketSolucionesListProps {
  data: SolucionTicketItem[];
  itemsPerPage?: number;
  onEdit: (item: SolucionTicketItem) => void;
  onDelete: (item: SolucionTicketItem) => void;
}

function SolucionTitleCell({ item }: { item: SolucionTicketItem }) {
  return (
    <AppStack gap="md" className="min-w-[240px]">
      <AppInline align="center" gap="xs" className="min-w-0">
        <CheckCircle2
          size={14}
          className="shrink-0 text-[hsl(var(--app-primary))]"
        />

        <p
          className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]"
          title={item.solucion}
        >
          {item.solucion || "Sin título"}
        </p>
      </AppInline>

      <p
        className="line-clamp-2 text-[10.5px] leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))] md:hidden"
        title={item.descripcion}
      >
        {item.descripcion || "Sin descripción"}
      </p>
    </AppStack>
  );
}

function SolucionDescriptionCell({ item }: { item: SolucionTicketItem }) {
  return (
    <p
      className="line-clamp-2 max-w-[720px] text-[11px] leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
      title={item.descripcion}
    >
      {item.descripcion || "Sin descripción"}
    </p>
  );
}

function SolucionUsageCell({ item }: { item: SolucionTicketItem }) {
  const count = getSolucionTicketCount(item);

  return (
    <AppInline align="center" justify="center" gap="xs">
      <AppBadge
        tone={count > 0 ? "primary" : "neutral"}
        appearance="soft"
        size="xs"
      >
        <Activity size={12} />
        {count}
      </AppBadge>
    </AppInline>
  );
}

function SolucionEstadoCell({ item }: { item: SolucionTicketItem }) {
  return (
    <AppInline align="center" justify="end">
      <AppBadge tone={getSolucionEstadoTone(item)} appearance="soft" size="xs">
        {getSolucionEstadoLabel(item)}
      </AppBadge>
    </AppInline>
  );
}

function SolucionesToolbar({ total }: { total: number }) {
  return (
    <AppInline align="center" justify="between" gap="sm" wrap>
      <AppInline align="center" gap="xs" className="min-w-0">
        <Ticket size={15} className="text-[hsl(var(--app-primary))]" />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
            Soluciones
          </p>
          <p className="truncate text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            Catálogo general de soluciones rápidas.
          </p>
        </div>
      </AppInline>

      <AppBadge tone="neutral" appearance="soft" size="xs">
        Total: {total}
      </AppBadge>
    </AppInline>
  );
}

function SolucionMobileCard({
  item,
  onEdit,
  onDelete,
}: {
  item: SolucionTicketItem;
  onEdit: (item: SolucionTicketItem) => void;
  onDelete: (item: SolucionTicketItem) => void;
}) {
  return (
    <AppCard variant="outline" size="xs">
      <AppStack gap="sm">
        <AppInline align="start" justify="between" gap="sm">
          <SolucionTitleCell item={item} />

          <AppBadge
            tone={getSolucionEstadoTone(item)}
            appearance="soft"
            size="xs"
          >
            {getSolucionEstadoLabel(item)}
          </AppBadge>
        </AppInline>

        <p className="text-[11px] leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          {item.descripcion || "Sin descripción"}
        </p>

        <AppInline align="center" justify="between" gap="sm">
          <AppBadge tone="neutral" appearance="soft" size="xs">
            #{item.id}
          </AppBadge>

          <AppBadge tone="primary" appearance="soft" size="xs">
            <Ticket size={12} />
            {getSolucionTicketCount(item)}
          </AppBadge>
        </AppInline>

        <AppInline align="center" justify="end" gap="xs">
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={<SquarePen size={12} />}
            onClick={() => onEdit(item)}
          >
            Editar
          </AppButton>

          <AppButton
            type="button"
            variant="danger"
            size="xs"
            width="auto"
            leftIcon={<Trash2 size={12} />}
            onClick={() => onDelete(item)}
          >
            Eliminar
          </AppButton>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}

export function TicketSolucionesList({
  data,
  itemsPerPage = 10,
  onEdit,
  onDelete,
}: TicketSolucionesListProps) {
  const table = useAppTableHandlers({
    initialPageSize: Math.min(itemsPerPage, 20),
    initialSorting: [{ id: "id", desc: true }],
  });

  const columns = React.useMemo<ColumnDef<SolucionTicketItem, any>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        size: 56,
        minSize: 52,
        maxSize: 64,
        enableSorting: false,
        meta: {
          align: "center",
        },
        cell: ({ row }) => (
          <span className="text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            #{row.original.id}
          </span>
        ),
      },
      {
        id: "solucion",
        header: "Solución",
        size: 260,
        minSize: 220,
        maxSize: 320,
        enableSorting: false,
        cell: ({ row }) => <SolucionTitleCell item={row.original} />,
      },
      {
        id: "descripcion",
        header: "Descripción",
        size: 340,
        minSize: 360,
        enableSorting: false,
        meta: {
          grow: true,
        },
        cell: ({ row }) => <SolucionDescriptionCell item={row.original} />,
      },
      {
        id: "uso",
        header: "Uso",
        size: 72,
        minSize: 64,
        maxSize: 84,
        enableSorting: false,
        meta: {
          align: "center",
        },
        cell: ({ row }) => <SolucionUsageCell item={row.original} />,
      },
      {
        id: "estado",
        header: "Estado",
        size: 92,
        minSize: 84,
        maxSize: 108,
        enableSorting: false,
        meta: {
          align: "right",
        },
        cell: ({ row }) => <SolucionEstadoCell item={row.original} />,
      },
      createAppRowActionsColumn<SolucionTicketItem>({
        header: "",
        size: 44,
        actions: (row) => [
          {
            label: "Editar",
            icon: <SquarePen size={13} />,
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

  if (data.length === 0) {
    return (
      <AppCard variant="outline" size="sm">
        <AppEmptyState
          preset="empty"
          variant="plain"
          size="sm"
          align="center"
          icon={<FileText size={34} strokeWidth={1.5} />}
          title="Sin registros"
          description="No hay soluciones rápidas registradas en el catálogo."
          className="py-8"
        />
      </AppCard>
    );
  }

  return (
    <AppDataTable
      data={data}
      columns={columns}
      getRowId={(row) => String(row.id)}
      toolbar={<SolucionesToolbar total={data.length} />}
      // density="xs"
      responsiveMode="cards"
      renderMobileCard={(row) => (
        <SolucionMobileCard
          item={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      paginationMode="client"
      pagination={table.getPaginationConfig({
        totalRows: data.length,
        pageSizeOptions: [5, 10, 20],
      })}
      maxHeight="560px"
      {...table.getDataTableStateProps()}
    />
  );
}
