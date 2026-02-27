import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { ticketsSoporteQkeys } from "./Qk";
import { Ticket } from "@/Crm/CrmTickets/ticketTypes";
import { EstadoTicketSoporte } from "@/Crm/DashboardCRM/types";
import { MetaPropsResponse } from "@/Crm/features/meta-server-response/meta-responses";

interface PropsResponse {
  data: Array<Ticket>;
  ticketsData?: TicketsData;
  meta: MetaPropsResponse;
}

export interface TicketsData {
  ticketsDisponibles: number;
  ticketEnProceso: number;
  ticketsResueltos: number;
}

export class QuerySearchTickets {
  page?: number = 1;

  limit?: number = 10;

  search?: string;

  estado?: EstadoTicketSoporte | undefined;

  tags?: number[];

  tecs?: number[];

  fechaInicio?: Date;

  fechaFin?: Date;

  creadosPor?: number;
}
export function useGetTicketsSoporte(query: QuerySearchTickets) {
  return useCrmQuery<PropsResponse>(
    ticketsSoporteQkeys.search(query),
    `tickets-soporte`,
    {
      params: query,
    },
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

export function useGetTicketsSoporteFromCustomer() {
  return useCrmQuery(ticketsSoporteQkeys.all, `tickets-soporte`, undefined, {
    staleTime: 0,
    gcTime: 1000 * 60,
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: 1,
  });
}
