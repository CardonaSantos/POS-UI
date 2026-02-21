import { QuerySearchTickets } from "./useTicketsSoporte";

export const ticketsSoporteQkeys = {
  all: ["tickets-soporte"],
  specific: (id: number) => ["tickets-soporte", id] as const,
  search: (query: QuerySearchTickets) => ["tickets-soporte", query] as const,
};
