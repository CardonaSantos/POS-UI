import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { ticketsSoporteQkeys } from "./Qk";
import { Ticket } from "@/Crm/CrmTickets/ticketTypes";

export function useGetTicketsSoporte() {
    return useCrmQuery<Array<Ticket>>(
        ticketsSoporteQkeys.all,
        `tickets-soporte`,
        undefined,
      {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
    )
}

export function useGetTicketsSoporteFromCustomer() {
    return useCrmQuery(
        ticketsSoporteQkeys.all,
        `tickets-soporte`,
        undefined,
      {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
    )
}
