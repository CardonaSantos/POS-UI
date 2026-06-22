import type { CSSProperties } from "react";

import type { Ticket } from "../ticketTypes";
import type { TicketsData } from "@/Crm/CrmHooks/hooks/use-tickets/useTicketsSoporte";

export type TicketListTabValue = "inbox" | "enProceso" | "lista";

export const TICKET_LIST_TABS = [
  {
    value: "inbox",
    label: "Todos",
    countKey: "ticketsDisponibles" as const,
    emptyMessage: {
      title: "Todo al día",
      description: "No hay tickets pendientes.",
    },
  },
  {
    value: "enProceso",
    label: "En proceso",
    countKey: "ticketEnProceso" as const,
    emptyMessage: {
      title: "Sin actividad",
      description: "No hay tickets en proceso.",
    },
  },
  {
    value: "lista",
    label: "Resueltos",
    countKey: "ticketsResueltos" as const,
    emptyMessage: {
      title: "Sin resueltos",
      description: "Aún no hay tickets resueltos.",
    },
  },
] as const;

const AVATAR_PALETTE = [
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#dc2626",
  "#ea580c",
  "#0891b2",
  "#4f46e5",
  "#be123c",
  "#0f766e",
  "#9333ea",
];

export function getTicketAvatarStyle(ticketId: number): CSSProperties {
  const color = AVATAR_PALETTE[Math.abs(ticketId) % AVATAR_PALETTE.length];

  return {
    backgroundColor: color,
  };
}

export function getTicketInitials(ticket: Ticket) {
  const name = ticket.customer?.name?.trim();

  if (!name) return "NA";

  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function getTicketTabCount(
  ticketsData: TicketsData,
  countKey: keyof TicketsData,
) {
  return ticketsData[countKey] ?? 0;
}

export function normalizeTicketStatus(status: string) {
  return status.replace(/_/g, " ");
}

export function getTicketPriorityTone(priority: string) {
  switch (priority) {
    case "URGENTE":
      return "danger";
    case "ALTA":
      return "warning";
    case "MEDIA":
      return "info";
    case "BAJA":
      return "neutral";
    default:
      return "neutral";
  }
}

export function getTicketStatusTone(status: string) {
  switch (status) {
    case "NUEVO":
    case "ABIERTA":
      return "info";

    case "EN_PROCESO":
    case "PENDIENTE":
    case "PENDIENTE_CLIENTE":
    case "PENDIENTE_TECNICO":
    case "PENDIENTE_REVISION":
      return "warning";

    case "RESUELTA":
    case "CERRADO":
      return "success";

    case "CANCELADA":
    case "ARCHIVADA":
      return "neutral";

    default:
      return "neutral";
  }
}

export const LIVE_TICKET_STATUSES = new Set([
  "NUEVO",
  "ABIERTA",
  "EN_PROCESO",
  "PENDIENTE",
  "PENDIENTE_CLIENTE",
  "PENDIENTE_TECNICO",
  "PENDIENTE_REVISION",
]);
