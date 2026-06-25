import type { Ticket } from "../ticketTypes";
import type { updateTicketDto } from "@/Crm/features/ticket/ticket-types";
import { formatDateGT } from "@/Crm/Utils/dayjs-utility";

export function getTicketCustomerInitials(ticket: Ticket) {
  const name = ticket.customer?.name?.trim();

  if (!name) return "NA";

  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function safeFormatTicketDate(value?: string | null) {
  if (!value) return "";

  try {
    return formatDateGT(value);
  } catch {
    return "";
  }
}

export function buildUpdateTicketPayload(ticket: Ticket): updateTicketDto {
  return {
    title: ticket.title.trim(),
    description: ticket.description?.trim() || "",
    priority: ticket.priority,
    status: ticket.status,
    fixed: ticket.fixed,

    clienteId: ticket.customer?.id ?? null,
    tecnicoId: ticket.assignee?.id ?? null,

    tecnicosAdicionales:
      ticket.companios?.map((companion) => companion.id) ?? [],
    tags: ticket.tags?.map((tag) => Number(tag.value)) ?? [],
  };
}

export function deferTicketDetailAction(callback: () => void) {
  window.setTimeout(callback, 0);
}
