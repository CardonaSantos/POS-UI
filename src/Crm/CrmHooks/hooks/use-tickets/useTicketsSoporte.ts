import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { ticketsSoporteQkeys } from "./Qk";
import { Ticket } from "@/Crm/CrmTickets/ticketTypes";
import { MetaPropsResponse } from "@/Crm/features/meta-server-response/meta-responses";
import { ComentarioSeguimientoDto } from "@/Crm/CrmTickets/TicketDetail/CrmTicketDetails";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { crm } from "@/Crm/API/crmApi";
import { EstadoTicketSoporte } from "@/Crm/features/dashboard/dashboard-tickets";
import { updateTicketDto } from "@/Crm/features/ticket/ticket-types";
import { PayloadCreateTicket } from "@/Crm/CrmTickets/CreateTickets/CrmCreateTicket";
import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import { useQueryClient } from "@tanstack/react-query";
import { ticketHistoryQkeys } from "./useTicketHistory";

interface PropsResponse {
  data: Array<Ticket>;
  ticketsData?: TicketsData;
  meta: MetaPropsResponse;
}

export interface TicketsData {
  ticketsDisponibles: number;
  ticketEnProceso: number;
  ticketsResueltos: number;
  ticketsCancelados: number;
}

export type TicketQuickView = "all" | "assignedToMe" | "createdByMe";

export class QuerySearchTickets {
  page?: number = 1;

  limit?: number = 10;

  search?: string;

  estado?: EstadoTicketSoporte | undefined;

  tags?: number[];

  tecs?: number[];

  sector?: number;

  fechaInicio?: string;

  fechaFin?: string;

  creadosPor?: number;

  vista?: string;
}

export function useGetTicketsSoporte(query: QuerySearchTickets) {
  return crm.useQueryApi<PropsResponse>(
    ticketsSoporteQkeys.search(query),
    crm_endpoints.ticket.tickets_list_search,
    {
      params: query,
    },
  );
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
  const invalidate = useInvalidateQk();
  return crm.useMutationApi<void, ComentarioSeguimientoDto>(
    "post",
    crm_endpoints.ticket.post_commentary,
    undefined,
    {
      onSuccess: () => {
        invalidate(ticketsSoporteQkeys.search({}));
      },
    },
  );
}

/**
 * HOOK PARA CREAR TICKET
 * @returns
 */
export function useCreateTicket() {
  const q = useInvalidateQk();
  return crm.useMutationApi<void, PayloadCreateTicket>(
    "post",
    crm_endpoints.ticket.create_ticket,
    undefined,
    {
      onSuccess: () => {
        q(ticketsSoporteQkeys.search({}));
      },
    },
  );
}

/**
 * Payload real utilizado actualmente por la edición.
 *
 * userId identifica al actor para la auditoría.
 */
export type UpdateTicketMutationPayload = updateTicketDto & {
  userId?: number;
};

/**
 * ACTUALIZAR TICKET
 */
export function useUpdateTicket(id: number) {
  const queryClient = useQueryClient();

  return crm.useMutationApi<void, UpdateTicketMutationPayload>(
    "patch",

    crm_endpoints.ticket.update_ticket(id),

    undefined,

    {
      onSuccess: async () => {
        /**
         * La mutación no se considera completamente
         * terminada hasta que ambas familias de queries
         * hayan sido invalidadas/refrescadas.
         *
         * 1. listado/detalle actual del ticket;
         * 2. historial generado por el mismo update.
         */
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ticketsSoporteQkeys.all,
          }),

          queryClient.invalidateQueries({
            queryKey: ticketHistoryQkeys.ticket(id),
          }),
        ]);
      },
    },
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
