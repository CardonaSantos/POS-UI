"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Edit,
  RefreshCw,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
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

import { formateDate } from "@/Crm/Utils/FormateDate";
import type { MetaTecnicoTicket } from "./types";
import {
  calcularDiasTotales,
  calcularDiasTranscurridos,
  calcularPorcentajeCumplido,
  calcularPromedioTicketsPorDia,
  calcularProyeccionCumplimiento,
  calcularTicketsFaltantes,
  getEstadoMetaTone,
} from "./metas-tecnicos.helpers";

interface MetasTicketsTableProps {
  metas: MetaTecnicoTicket[];
  isLoading: boolean;
  canManage: boolean;
  operationLoading?: boolean;
  onCreateFirst: () => void;
  onEdit: (meta: MetaTecnicoTicket) => void;
  onDelete: (meta: MetaTecnicoTicket) => void;
  onRefresh?: () => void | Promise<void>;
}

function getProgressTone(porcentaje: number) {
  if (porcentaje >= 100) return "success";
  if (porcentaje >= 75) return "warning";
  return "danger";
}

function getProjectionTone(proyeccion: number, meta: number) {
  return proyeccion >= meta ? "success" : "danger";
}

function getToneTextClass(tone: "success" | "warning" | "danger") {
  if (tone === "success") return "text-[hsl(var(--app-success))]";
  if (tone === "warning") return "text-[hsl(var(--app-warning))]";
  return "text-[hsl(var(--app-danger))]";
}

function MetaProgressBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));
  const tone = getProgressTone(value);

  return (
    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--app-muted,var(--muted))/0.55)]">
      <div
        className={[
          "h-full rounded-full transition-all",
          tone === "success"
            ? "bg-[hsl(var(--app-success))]"
            : tone === "warning"
              ? "bg-[hsl(var(--app-warning))]"
              : "bg-[hsl(var(--app-danger))]",
        ].join(" ")}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

function TechnicianCell({ meta }: { meta: MetaTecnicoTicket }) {
  return (
    <AppStack gap="md" className="min-w-[180px]">
      <p className="truncate text-xs font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
        {meta.tecnico?.nombre ?? "Sin técnico"}
      </p>

      <p className="truncate text-[10.5px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {meta.titulo || "Sin título"}
      </p>
    </AppStack>
  );
}

function PeriodCell({ meta }: { meta: MetaTecnicoTicket }) {
  const diasTranscurridos = calcularDiasTranscurridos(meta.fechaInicio);
  const diasTotales = calcularDiasTotales(meta.fechaInicio, meta.fechaFin);

  return (
    <AppStack gap="md" className="min-w-[140px]">
      <p className="text-[11px] font-medium text-[hsl(var(--app-foreground,var(--foreground)))]">
        {formateDate(meta.fechaInicio)}
      </p>

      <p className="text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
        {formateDate(meta.fechaFin)}
      </p>

      <AppBadge tone="neutral" appearance="soft" size="xs">
        {diasTranscurridos}/{diasTotales} días
      </AppBadge>
    </AppStack>
  );
}

function PercentCell({ meta }: { meta: MetaTecnicoTicket }) {
  const porcentaje = calcularPorcentajeCumplido(
    meta.ticketsResueltos,
    meta.metaTickets,
  );

  const tone = getProgressTone(porcentaje);

  return (
    <div className="min-w-[90px] text-right">
      <p className={`text-xs font-bold ${getToneTextClass(tone)}`}>
        {porcentaje}%
      </p>

      <MetaProgressBar value={porcentaje} />
    </div>
  );
}

function ProjectionCell({ meta }: { meta: MetaTecnicoTicket }) {
  const diasTranscurridos = calcularDiasTranscurridos(meta.fechaInicio);
  const diasTotales = calcularDiasTotales(meta.fechaInicio, meta.fechaFin);
  const proyeccion = calcularProyeccionCumplimiento(
    meta.ticketsResueltos,
    diasTranscurridos,
    diasTotales,
  );

  const tone = getProjectionTone(proyeccion, meta.metaTickets);

  return (
    <AppInline align="center" justify="end" gap="xs">
      <span className={`text-xs font-bold ${getToneTextClass(tone)}`}>
        {proyeccion}
      </span>

      {tone === "success" ? (
        <TrendingUp size={13} className="text-[hsl(var(--app-success))]" />
      ) : (
        <TrendingDown size={13} className="text-[hsl(var(--app-danger))]" />
      )}
    </AppInline>
  );
}

function NumberCell({ value }: { value: number | string }) {
  return (
    <span className="text-xs font-medium text-[hsl(var(--app-foreground,var(--foreground)))]">
      {value}
    </span>
  );
}

function MetasTableToolbar({
  canManage,
  onCreateFirst,
  onRefresh,
}: {
  canManage: boolean;
  onCreateFirst: () => void;
  onRefresh?: () => void | Promise<void>;
}) {
  return (
    <AppInline align="center" justify="between" gap="sm" wrap>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[hsl(var(--app-foreground,var(--foreground)))]">
          Metas activas
        </p>
        <p className="truncate text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
          Avance, proyección y cumplimiento por técnico.
        </p>
      </div>

      <AppInline align="center" gap="xs">
        {onRefresh ? (
          <AppButton
            type="button"
            variant="secondary"
            size="xs"
            width="auto"
            leftIcon={<RefreshCw size={13} />}
            onClick={() => void onRefresh()}
          >
            Recargar
          </AppButton>
        ) : null}

        <AppButton
          type="button"
          variant="primary"
          size="xs"
          width="auto"
          leftIcon={<Target size={13} />}
          onClick={onCreateFirst}
          disabled={!canManage}
        >
          Nueva meta
        </AppButton>
      </AppInline>
    </AppInline>
  );
}

function EmptyMetasState({
  canManage,
  onCreateFirst,
}: {
  canManage: boolean;
  onCreateFirst: () => void;
}) {
  return (
    <AppCard variant="outline" size="sm">
      <AppEmptyState
        preset="empty"
        variant="plain"
        size="sm"
        align="center"
        icon={<Target size={32} strokeWidth={1.5} />}
        title="No hay metas registradas"
        description="Cree una meta para comenzar a medir el rendimiento técnico por tickets."
        action={
          <AppButton
            type="button"
            variant="primary"
            size="xs"
            width="auto"
            leftIcon={<Target size={13} />}
            onClick={onCreateFirst}
            disabled={!canManage}
          >
            Crear primera meta
          </AppButton>
        }
        className="py-8"
      />
    </AppCard>
  );
}

function renderMobileMetaCard(meta: MetaTecnicoTicket) {
  const porcentaje = calcularPorcentajeCumplido(
    meta.ticketsResueltos,
    meta.metaTickets,
  );
  const faltantes = calcularTicketsFaltantes(
    meta.ticketsResueltos,
    meta.metaTickets,
  );
  const diasTranscurridos = calcularDiasTranscurridos(meta.fechaInicio);
  const diasTotales = calcularDiasTotales(meta.fechaInicio, meta.fechaFin);
  const promedioDiario = calcularPromedioTicketsPorDia(
    meta.ticketsResueltos,
    diasTranscurridos,
  );
  const proyeccion = calcularProyeccionCumplimiento(
    meta.ticketsResueltos,
    diasTranscurridos,
    diasTotales,
  );

  return (
    <AppCard variant="outline" size="xs">
      <AppStack gap="sm">
        <AppInline align="start" justify="between" gap="sm">
          <TechnicianCell meta={meta} />

          <AppBadge
            tone={getEstadoMetaTone(meta.estado)}
            appearance="soft"
            size="xs"
          >
            {meta.estado}
          </AppBadge>
        </AppInline>

        <MetaProgressBar value={porcentaje} />

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <p className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Objetivo
            </p>
            <p className="font-semibold">{meta.metaTickets}</p>
          </div>

          <div>
            <p className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Resueltos
            </p>
            <p className="font-semibold">{meta.ticketsResueltos}</p>
          </div>

          <div>
            <p className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Faltantes
            </p>
            <p className="font-semibold">{faltantes}</p>
          </div>

          <div>
            <p className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Promedio/día
            </p>
            <p className="font-semibold">{promedioDiario}</p>
          </div>

          <div>
            <p className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Proyección
            </p>
            <p className="font-semibold">{proyeccion}</p>
          </div>

          <div>
            <p className="text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              Días
            </p>
            <p className="font-semibold">
              {diasTranscurridos}/{diasTotales}
            </p>
          </div>
        </div>
      </AppStack>
    </AppCard>
  );
}

export function MetasTicketsTable({
  metas,
  isLoading,
  canManage,
  operationLoading,
  onCreateFirst,
  onEdit,
  onDelete,
  onRefresh,
}: MetasTicketsTableProps) {
  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialSorting: [{ id: "tecnico", desc: false }],
  });

  const columns = React.useMemo<ColumnDef<MetaTecnicoTicket, any>[]>(
    () => [
      {
        id: "tecnico",
        header: "Técnico",
        size: 310,
        cell: ({ row }) => <TechnicianCell meta={row.original} />,
      },
      {
        id: "periodo",
        header: "Período",
        size: 80,
        cell: ({ row }) => <PeriodCell meta={row.original} />,
      },
      {
        id: "objetivo",
        header: "Objetivo",
        size: 60,
        meta: {
          align: "right",
        },
        cell: ({ row }) => <NumberCell value={row.original.metaTickets} />,
      },
      {
        id: "resueltos",
        header: "Resueltos",
        size: 60,
        meta: {
          align: "right",
        },
        cell: ({ row }) => <NumberCell value={row.original.ticketsResueltos} />,
      },
      {
        id: "porcentaje",
        header: "% Cumplido",
        size: 45,
        meta: {
          align: "right",
        },
        cell: ({ row }) => <PercentCell meta={row.original} />,
      },
      {
        id: "faltantes",
        header: "Faltantes",
        size: 45,
        meta: {
          align: "right",
        },
        cell: ({ row }) => {
          const faltantes = calcularTicketsFaltantes(
            row.original.ticketsResueltos,
            row.original.metaTickets,
          );

          return <NumberCell value={faltantes} />;
        },
      },
      {
        id: "promedioDia",
        header: "Promedio/día",
        size: 75,
        meta: {
          align: "right",
        },
        cell: ({ row }) => {
          const diasTranscurridos = calcularDiasTranscurridos(
            row.original.fechaInicio,
          );

          const promedio = calcularPromedioTicketsPorDia(
            row.original.ticketsResueltos,
            diasTranscurridos,
          );

          return <NumberCell value={promedio} />;
        },
      },
      {
        id: "proyeccion",
        header: "Proyección",
        size: 100,
        meta: {
          align: "right",
        },
        cell: ({ row }) => <ProjectionCell meta={row.original} />,
      },
      {
        id: "estado",
        header: "Estado",
        size: 80,
        cell: ({ row }) => (
          <AppBadge
            tone={getEstadoMetaTone(row.original.estado)}
            appearance="soft"
            size="xs"
          >
            {row.original.estado}
          </AppBadge>
        ),
      },
      createAppRowActionsColumn<MetaTecnicoTicket>({
        // align: "end",
        // side: "bottom",
        actions: (row) => [
          {
            label: "Editar",
            icon: <Edit size={13} />,
            disabled: !canManage || operationLoading,
            onClick: () => onEdit(row.original),
          },
          {
            label: "Eliminar",
            icon: <Trash2 size={13} />,
            tone: "danger",
            separatorBefore: true,
            disabled: !canManage || operationLoading,
            onClick: () => onDelete(row.original),
          },
        ],
      }),
    ],
    [canManage, operationLoading, onDelete, onEdit],
  );

  if (!isLoading && metas.length === 0) {
    return (
      <AppStack gap="sm">
        <MetasTableToolbar
          canManage={canManage}
          onCreateFirst={onCreateFirst}
          onRefresh={onRefresh}
        />

        <EmptyMetasState canManage={canManage} onCreateFirst={onCreateFirst} />
      </AppStack>
    );
  }

  return (
    <AppDataTable
      data={metas}
      columns={columns}
      getRowId={(row) => String(row.id)}
      isLoading={isLoading}
      onRetry={onRefresh}
      toolbar={
        <MetasTableToolbar
          canManage={canManage}
          onCreateFirst={onCreateFirst}
          onRefresh={onRefresh}
        />
      }
      paginationMode="client"
      pagination={table.getPaginationConfig({
        totalRows: metas.length,
        pageSizeOptions: [10, 20, 50],
      })}
      //   density="sm"
      responsiveMode="cards"
      renderMobileCard={(row) => renderMobileMetaCard(row.original)}
      enableVirtualization={false}
      maxHeight="620px"
      {...table.getDataTableStateProps()}
    />
  );
}
