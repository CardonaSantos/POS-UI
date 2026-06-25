"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Settings,
  Timer,
  User,
} from "lucide-react";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import {
  AppDialog,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppDataTable } from "@/components/app/table/app-data-table";
import {
  useAppDisclosure,
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";

import { EstadoTicket, TicketMoment } from "./types";
import { PrioridadTicketSoporte } from "../../features/dashboard/dashboard-tickets";

type TicketTab = "todos" | "proceso" | "pendientes";

type BadgeTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

function getPrioridadTone(prioridad: PrioridadTicketSoporte): BadgeTone {
  if (
    prioridad === PrioridadTicketSoporte.URGENTE ||
    prioridad === PrioridadTicketSoporte.ALTA
  ) {
    return "danger";
  }

  if (prioridad === PrioridadTicketSoporte.MEDIA) return "warning";

  return "neutral";
}

function getPrioridadIcon(prioridad: PrioridadTicketSoporte) {
  if (
    prioridad === PrioridadTicketSoporte.URGENTE ||
    prioridad === PrioridadTicketSoporte.ALTA
  ) {
    return <AlertCircle size={12} />;
  }

  return null;
}

function getEstadoTone(estado: string): BadgeTone {
  if (estado === "EN_PROCESO") return "primary";
  if (estado === "PENDIENTE_REVISION" || estado === EstadoTicket.PENDIENTE) {
    return "warning";
  }

  return "neutral";
}

function getEstadoIcon(estado: string) {
  if (estado === "EN_PROCESO") return <Settings size={12} />;
  if (estado === "PENDIENTE_REVISION" || estado === EstadoTicket.PENDIENTE) {
    return <Eye size={12} />;
  }

  return <Clock size={12} />;
}

function formatEstado(estado: string) {
  return estado.replace("_", " ").toLowerCase();
}

function getClienteNombre(ticket: TicketMoment) {
  return `${ticket.cliente.nombre ?? ""} ${ticket.cliente.apellidos ?? ""}`.trim();
}

function getAcompanantes(ticket: TicketMoment) {
  return ticket.acompanantes?.map((item) => item.nombre).join(", ") || "";
}

function TicketDetailDialog({
  open,
  ticket,
  onOpenChange,
}: {
  open: boolean;
  ticket: TicketMoment | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!ticket) return null;

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent className="sm:max-w-[620px]">
        <AppDialogHeader>
          <AppDialogTitle>
            <AppInline align="center" gap="xs" wrap>
              <span>Ticket #{ticket.id}</span>

              <AppBadge
                tone={getPrioridadTone(ticket.prioridad)}
                appearance="soft"
                size="xs"
              >
                {getPrioridadIcon(ticket.prioridad)}
                {ticket.prioridad}
              </AppBadge>

              <AppBadge
                tone={getEstadoTone(ticket.estado)}
                appearance="soft"
                size="xs"
              >
                {getEstadoIcon(ticket.estado)}
                {formatEstado(ticket.estado)}
              </AppBadge>
            </AppInline>
          </AppDialogTitle>

          <AppDialogDescription>
            Detalles compactos del ticket seleccionado.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppStack gap="md">
          <AppCard variant="outline" size="xs" className="px-3 py-2">
            <AppStack gap="xs">
              <p className="text-xs font-semibold">{ticket.titulo}</p>
              <p className="text-[11px] leading-4 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                {ticket.descripcion || "Sin descripción"}
              </p>
            </AppStack>
          </AppCard>

          <div className="grid gap-2 sm:grid-cols-2">
            <AppCard variant="outline" size="xs" className="px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Cliente
              </p>
              <p className="truncate text-xs font-medium">
                {getClienteNombre(ticket)}
              </p>
              <p className="text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                ID: {ticket.cliente.id}
              </p>
            </AppCard>

            <AppCard variant="outline" size="xs" className="px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Técnico
              </p>
              <p className="truncate text-xs font-medium">
                {ticket.tecnico?.nombre || "Sin asignar"}
              </p>
              <p className="truncate text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
                Acompañantes: {getAcompanantes(ticket) || "Sin acompañantes"}
              </p>
            </AppCard>
          </div>
        </AppStack>
      </AppDialogContent>
    </AppDialog>
  );
}

export default function ImprovedTicketsComponent({
  data,
}: {
  data: TicketMoment[];
}) {
  const detailDialog = useAppDisclosure();
  const ui = useAppStateHandlers<{
    activeTab: TicketTab;
    selectedTicket: TicketMoment | null;
  }>({
    activeTab: "todos",
    selectedTicket: null,
  });

  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialDensity: "xs",
  });

  const { ticketsEnProceso, ticketsPendientes } = React.useMemo(() => {
    return {
      ticketsEnProceso: data.filter((ticket) => ticket.estado === "EN_PROCESO"),
      ticketsPendientes: data.filter(
        (ticket) =>
          ticket.estado === EstadoTicket.PENDIENTE ||
          ticket.estado === EstadoTicket.PENDIENTE_TECNICO,
      ),
    };
  }, [data]);

  const visibleTickets = React.useMemo(() => {
    if (ui.state.activeTab === "proceso") return ticketsEnProceso;
    if (ui.state.activeTab === "pendientes") return ticketsPendientes;

    return data;
  }, [data, ticketsEnProceso, ticketsPendientes, ui.state.activeTab]);

  const openTicket = React.useCallback(
    (ticket: TicketMoment) => {
      ui.setField("selectedTicket", ticket);
      detailDialog.open();
    },
    [detailDialog, ui],
  );

  const columns = React.useMemo<ColumnDef<TicketMoment, any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "#",
        size: 56,
        minSize: 52,
        maxSize: 64,
        meta: { align: "center" },
        cell: ({ row }) => (
          <span className="font-mono text-[11px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            #{row.original.id}
          </span>
        ),
      },
      {
        accessorKey: "titulo",
        header: "Ticket",
        size: 260,
        minSize: 260,
        meta: { grow: true },
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => openTicket(row.original)}
            className="block min-w-0 text-left"
          >
            <span className="block truncate text-xs font-semibold text-[hsl(var(--app-primary))] hover:underline">
              {row.original.titulo}
            </span>
            <span className="block truncate text-[10.5px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              {row.original.descripcion || "Sin descripción"}
            </span>
          </button>
        ),
      },
      {
        id: "cliente",
        header: "Cliente",
        size: 190,
        minSize: 150,
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">
              {getClienteNombre(row.original)}
            </p>
            <p className="text-[10px] text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
              ID: {row.original.cliente.id}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "prioridad",
        header: "Prioridad",
        size: 110,
        minSize: 100,
        maxSize: 120,
        meta: { align: "center" },
        cell: ({ row }) => (
          <AppBadge
            tone={getPrioridadTone(row.original.prioridad)}
            appearance="soft"
            size="xs"
          >
            {getPrioridadIcon(row.original.prioridad)}
            {row.original.prioridad}
          </AppBadge>
        ),
      },
      {
        id: "estado",
        header: "Estado",
        size: 130,
        minSize: 110,
        maxSize: 150,
        cell: ({ row }) => (
          <AppBadge
            tone={getEstadoTone(row.original.estado)}
            appearance="soft"
            size="xs"
          >
            {getEstadoIcon(row.original.estado)}
            {formatEstado(row.original.estado)}
          </AppBadge>
        ),
      },
      {
        id: "tecnico",
        header: "Técnico",
        size: 150,
        minSize: 120,
        cell: ({ row }) => (
          <AppInline align="center" gap="xs" className="min-w-0">
            <User
              size={13}
              className="shrink-0 text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]"
            />
            <span className="truncate text-xs">
              {row.original.tecnico?.nombre || "Sin asignar"}
            </span>
          </AppInline>
        ),
      },
      {
        id: "acompanantes",
        header: "Acomp.",
        size: 140,
        minSize: 110,
        cell: ({ row }) => (
          <span className="block truncate text-xs text-[hsl(var(--app-muted-foreground,var(--muted-foreground)))]">
            {getAcompanantes(row.original) || "-"}
          </span>
        ),
      },
    ],
    [openTicket],
  );

  return (
    <AppCard
      variant="outline"
      size="xs"
      className="w-full bg-transparent"
      title="Tickets en proceso"
      description={`${data.length} ticket${data.length !== 1 ? "s" : ""} activo${
        data.length !== 1 ? "s" : ""
      }`}
      action={
        <AppInline align="center" gap="xs" wrap>
          <AppBadge tone="primary" appearance="soft" size="xs">
            <Timer size={12} />
            {ticketsEnProceso.length} en proceso
          </AppBadge>

          <AppBadge tone="warning" appearance="soft" size="xs">
            <Eye size={12} />
            {ticketsPendientes.length} pendientes
          </AppBadge>
        </AppInline>
      }
    >
      <AppStack gap="sm">
        <AppInline align="center" gap="xs" wrap>
          {[
            {
              value: "todos",
              label: `Todos (${data.length})`,
              icon: CheckCircle2,
            },
            {
              value: "proceso",
              label: `En proceso (${ticketsEnProceso.length})`,
              icon: Timer,
            },
            {
              value: "pendientes",
              label: `Pendientes (${ticketsPendientes.length})`,
              icon: Eye,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = ui.state.activeTab === tab.value;

            return (
              <AppButton
                key={tab.value}
                type="button"
                variant={active ? "primary" : "secondary"}
                size="xs"
                width="auto"
                leftIcon={<Icon size={12} />}
                onClick={() => ui.setField("activeTab", tab.value as TicketTab)}
              >
                {tab.label}
              </AppButton>
            );
          })}
        </AppInline>

        {visibleTickets.length === 0 ? (
          <AppEmptyState
            preset="empty"
            variant="plain"
            size="sm"
            align="center"
            icon={<Clock size={32} strokeWidth={1.5} />}
            title="Sin tickets"
            description="No hay tickets para mostrar en esta vista."
            className="py-8"
          />
        ) : (
          <AppDataTable
            data={visibleTickets}
            columns={columns}
            getRowId={(row) => String(row.id)}
            // density="xs"
            responsiveMode="cards"
            paginationMode="client"
            pagination={table.getPaginationConfig({
              totalRows: visibleTickets.length,
              pageSizeOptions: [10, 20, 50],
            })}
            maxHeight="420px"
            {...table.getDataTableStateProps()}
          />
        )}
      </AppStack>

      <TicketDetailDialog
        open={detailDialog.isOpen}
        ticket={ui.state.selectedTicket}
        onOpenChange={detailDialog.setOpen}
      />
    </AppCard>
  );
}
