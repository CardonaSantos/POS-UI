import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { ticketsSoporteQkeys } from "./Qk";
import { Ticket } from "@/Crm/CrmTickets/ticketTypes";
import { MetaPropsResponse } from "@/Crm/features/meta-server-response/meta-responses";
import { ComentarioSeguimientoDto } from "@/Crm/CrmTickets/TicketDetail/CrmTicketDetails";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { crm } from "@/Crm/API/crmApi";
import { EstadoTicketSoporte } from "@/Crm/features/dashboard/dashboard-tickets";
import { updateTicketDto } from "@/Crm/features/ticket/ticket-types";

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
  return crm.useQueryApi<PropsResponse>(
    ticketsSoporteQkeys.search(query),
    crm_endpoints.ticket.tickets_list_search,
    {
      params: query,
    },
  );
  // return useCrmQuery<PropsResponse>(

  //   ticketsSoporteQkeys.search(query),
  //   `tickets-soporte`,
  //   {
  //     params: query,
  //   },
  // );
}

/**
 *
 * @returns
 */
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

/**
 * HOOK PARA COMENTAR EN TICKET
 * @returns
 */
export function usePostCommentary() {
  return crm.useMutationApi<void, ComentarioSeguimientoDto>(
    "post",
    crm_endpoints.ticket.post_commentary,
  );
}

/**
 * ACTUALIZAR TICKET
 * @param id
 * @returns
 */
export function useUpdateTicket(id: number) {
  return crm.useMutationApi<void, updateTicketDto>(
    "patch",
    crm_endpoints.ticket.update_ticket(id),
  );
}

/**
 * ELIMINAR TICKET
 * @param id
 * @returns
 */
export function useDeleteTicket(id: number) {
  return crm.useMutationApi<void, void>(
    "delete",
    crm_endpoints.ticket.delete_ticket(id),
  );
}
