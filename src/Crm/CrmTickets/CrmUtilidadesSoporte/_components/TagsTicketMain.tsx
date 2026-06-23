"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  FileText,
  PlusCircle,
  Search,
  Tag,
  Ticket,
  Trash2,
} from "lucide-react";

import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppDataTable } from "@/components/app/table/app-data-table";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppInput } from "@/components/app/primitives/app-input";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppSkeleton } from "@/components/app/primitives/app-skeleton";
import { createAppRowActionsColumn } from "@/components/app/table/app-table-row-actions";
import { useAppTableHandlers } from "@/components/app/handlers";

import type { EtiquetaTicket } from "@/Crm/features/tags/tags.interfaces";
import {
  getEtiquetaTicketCount,
  getEtiquetaToneById,
  TagTicketStats,
} from "./ticket-tags.helpers";

interface TagsTicketMainProps {
  searchEtiqueta: string;
  isLoading: boolean;
  stats: TagTicketStats;
  etiquetas: EtiquetaTicket[];
  filteredEtiquetas: EtiquetaTicket[];
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onEditClick: (etiqueta: EtiquetaTicket) => void;
  onDeleteClick: (etiqueta: EtiquetaTicket) => void;
}

function TagsToolbar({
  searchEtiqueta,
  onSearchChange,
  onCreateClick,
}: {
  searchEtiqueta: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
}) {
  return (
    <AppInline align="center" justify="between" gap="sm" wrap>
      <AppInline align="center" gap="xs" wrap className="w-full sm:w-auto">
        <AppInput
          value={searchEtiqueta}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar etiquetas..."
          size="xs"
          fieldWidth="full"
          leftIcon={<Search size={13} />}
          className="sm:w-[260px]"
        />

        <AppButton
          type="button"
          variant="primary"
          size="xs"
          width="auto"
          leftIcon={<PlusCircle size={13} />}
          onClick={onCreateClick}
        >
          Nueva etiqueta
        </AppButton>
      </AppInline>
    </AppInline>
  );
}

function TagsStatsGrid({ stats }: { stats: TagTicketStats }) {
  return (
    <AppGrid cols={{ base: 1, sm: 2 }} gap="xs">
      <AppCard variant="outline" size="xs" className="px-3 py-2">
        <AppInline align="center" justify="between" gap="sm">
          <AppInline align="center" gap="xs" className="min-w-0">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-primary)/0.12)] text-[hsl(var(--app-primary))]">
              <Tag size={13} />
            </span>

            <span className="truncate text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Total etiquetas
            </span>
          </AppInline>

          <span className="shrink-0 text-base font-bold tabular-nums text-[hsl(var(--app-primary))]">
            {stats.totalEtiquetas}
          </span>
        </AppInline>
      </AppCard>

      <AppCard variant="outline" size="xs" className="px-3 py-2">
        <AppInline align="center" justify="between" gap="sm">
          <AppInline align="center" gap="xs" className="min-w-0">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--app-radius-md)] bg-[hsl(var(--app-success)/0.12)] text-[hsl(var(--app-success))]">
              <Ticket size={13} />
            </span>

            <span className="truncate text-[11px] font-medium text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Tickets asociados
            </span>
          </AppInline>

          <span className="shrink-0 text-base font-bold tabular-nums text-[hsl(var(--app-success))]">
            {stats.totalTickets}
          </span>
        </AppInline>
      </AppCard>
    </AppGrid>
  );
}
function TagNameCell({ etiqueta }: { etiqueta: EtiquetaTicket }) {
  return (
    <AppInline align="center" gap="xs" className="min-w-[180px]">
      <AppBadge
        tone={getEtiquetaToneById(etiqueta.id)}
        appearance="soft"
        size="xs"
      >
        <Tag size={12} />
        {etiqueta.nombre}
      </AppBadge>
    </AppInline>
  );
}

function TicketsCountCell({ etiqueta }: { etiqueta: EtiquetaTicket }) {
  const count = getEtiquetaTicketCount(etiqueta);

  return (
    <AppInline align="center" justify="center" gap="xs">
      <AppBadge
        tone={count > 0 ? "primary" : "neutral"}
        appearance="soft"
        size="xs"
      >
        <Ticket size={12} />
        {count}
      </AppBadge>
    </AppInline>
  );
}

function TagsLoadingState() {
  return (
    <AppCard variant="outline" size="sm">
      <AppStack gap="sm" className="p-2">
        <AppSkeleton className="h-8 w-full" />
        <AppSkeleton className="h-8 w-full" />
        <AppSkeleton className="h-8 w-full" />
      </AppStack>
    </AppCard>
  );
}

function TagsEmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <AppCard variant="outline" size="sm">
      <AppEmptyState
        preset="empty"
        variant="plain"
        size="sm"
        align="center"
        icon={<FileText size={34} strokeWidth={1.5} />}
        title="No hay etiquetas"
        description="Cree una etiqueta para comenzar a clasificar tickets de soporte."
        action={
          <AppButton
            type="button"
            variant="primary"
            size="xs"
            width="auto"
            leftIcon={<PlusCircle size={13} />}
            onClick={onCreateClick}
          >
            Crear etiqueta
          </AppButton>
        }
        className="py-8"
      />
    </AppCard>
  );
}

function TagsNoResultsState({ search }: { search: string }) {
  return (
    <AppCard variant="outline" size="sm">
      <AppEmptyState
        preset="search"
        variant="plain"
        size="sm"
        align="center"
        icon={<Search size={34} strokeWidth={1.5} />}
        title="Sin resultados"
        description={`No se encontraron etiquetas para "${search}".`}
        className="py-8"
      />
    </AppCard>
  );
}

function renderMobileTagCard(
  etiqueta: EtiquetaTicket,
  onEditClick: (etiqueta: EtiquetaTicket) => void,
  onDeleteClick: (etiqueta: EtiquetaTicket) => void,
) {
  return (
    <AppCard variant="outline" size="xs">
      <AppStack gap="sm">
        <AppInline align="center" justify="between" gap="sm">
          <TagNameCell etiqueta={etiqueta} />
          <TicketsCountCell etiqueta={etiqueta} />
        </AppInline>

        <AppInline align="center" justify="end" gap="xs">
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={<Edit size={13} />}
            onClick={() => onEditClick(etiqueta)}
          >
            Editar
          </AppButton>

          <AppButton
            type="button"
            variant="danger"
            size="xs"
            width="auto"
            leftIcon={<Trash2 size={13} />}
            onClick={() => onDeleteClick(etiqueta)}
          >
            Eliminar
          </AppButton>
        </AppInline>
      </AppStack>
    </AppCard>
  );
}

export default function TagsTicketMain({
  searchEtiqueta,
  isLoading,
  stats,
  etiquetas,
  filteredEtiquetas,
  onSearchChange,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: TagsTicketMainProps) {
  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialSorting: [{ id: "nombre", desc: false }],
  });

  const columns = React.useMemo<ColumnDef<EtiquetaTicket, any>[]>(
    () => [
      {
        id: "nombre",
        header: "Etiqueta",
        size: 720,
        minSize: 360,
        meta: {
          grow: true,
        },
        cell: ({ row }) => <TagNameCell etiqueta={row.original} />,
      },
      {
        id: "tickets",
        header: "Tickets",
        size: 110,
        minSize: 90,
        maxSize: 130,
        meta: {
          align: "center",
        },
        cell: ({ row }) => <TicketsCountCell etiqueta={row.original} />,
      },
      createAppRowActionsColumn<EtiquetaTicket>({
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
            onClick: () => onDeleteClick(row.original),
          },
        ],
      }),
    ],
    [onDeleteClick, onEditClick],
  );

  const hasTags = etiquetas.length > 0;
  const hasResults = filteredEtiquetas.length > 0;

  return (
    <AppStack gap="md">
      <TagsToolbar
        searchEtiqueta={searchEtiqueta}
        onSearchChange={onSearchChange}
        onCreateClick={onCreateClick}
      />

      <TagsStatsGrid stats={stats} />

      {isLoading && !hasTags ? (
        <TagsLoadingState />
      ) : !hasTags ? (
        <TagsEmptyState onCreateClick={onCreateClick} />
      ) : !hasResults ? (
        <TagsNoResultsState search={searchEtiqueta} />
      ) : (
        <AppDataTable
          data={filteredEtiquetas}
          columns={columns}
          getRowId={(row) => String(row.id)}
          isLoading={isLoading}
          // density="sm"
          responsiveMode="cards"
          renderMobileCard={(row) =>
            renderMobileTagCard(row.original, onEditClick, onDeleteClick)
          }
          paginationMode="client"
          pagination={table.getPaginationConfig({
            totalRows: filteredEtiquetas.length,
            pageSizeOptions: [10, 20, 50],
          })}
          maxHeight="520px"
          {...table.getDataTableStateProps()}
        />
      )}
    </AppStack>
  );
}
