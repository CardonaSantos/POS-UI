import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";

// =========================================================
// TIPOS
// =========================================================

export type TicketHistoryType =
  | "CREADO"
  | "ACTUALIZADO"
  | "ESTADO_CAMBIADO"
  | "PRIORIDAD_CAMBIADA"
  | "ASIGNACION_CAMBIADA"
  | "CANCELADO"
  | "REABIERTO"
  | "FIJADO"
  | "DESFIJADO";

/**
 * Actor que realizó la operación.
 *
 * usuarioId puede ser null porque:
 *
 * - el usuario pudo ser eliminado posteriormente;
 * - el cambio pudo ser realizado por el sistema.
 *
 * El backend conserva usuarioNombre como snapshot histórico.
 */
export interface TicketHistoryActor {
  usuarioId: number | null;
  nombre: string;
}

/**
 * Registro individual del historial.
 */
export interface TicketHistoryItem {
  id: number;

  ticketId: number;

  tipo: TicketHistoryType;

  descripcion: string | null;

  actor: TicketHistoryActor;

  creadoEn: string;
}

/**
 * Meta estándar devuelta por el backend.
 */
export interface TicketHistoryMeta {
  page: number;
  limit: number;

  total: number;
  totalPages: number;

  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Response del endpoint:
 *
 * GET /ticket-soporte-historial/ticket/:ticketId
 */
export interface TicketHistoryResponse {
  data: TicketHistoryItem[];

  meta: TicketHistoryMeta;
}

// =========================================================
// QUERY
// =========================================================

export interface TicketHistoryQuery {
  page?: number;
  limit?: number;

  tipo?: TicketHistoryType;

  usuarioId?: number;

  search?: string;

  fechaDesde?: string;
  fechaHasta?: string;

  ordenDireccion?: "asc" | "desc";
}

// =========================================================
// QUERY KEYS
// =========================================================

export const ticketHistoryQkeys = {
  all: ["ticket-soporte-historial"] as const,

  ticket: (ticketId: number) =>
    [...ticketHistoryQkeys.all, "ticket", ticketId] as const,

  ticketWithQuery: (ticketId: number, query: TicketHistoryQuery) =>
    [...ticketHistoryQkeys.ticket(ticketId), query] as const,
};

// =========================================================
// HOOK
// =========================================================

/**
 * Obtiene el historial de modificaciones de un ticket.
 *
 * La consulta solamente se ejecuta si ticketId es válido.
 *
 * Esto permite montar TicketDetail sin lanzar requests
 * mientras todavía no existe un ticket seleccionado.
 */
export function useGetTicketHistory(
  ticketId: number | null | undefined,
  query: TicketHistoryQuery = {},
) {
  const normalizedTicketId = Number(ticketId);

  const isValidTicketId =
    Number.isInteger(normalizedTicketId) && normalizedTicketId > 0;

  const resolvedQuery: TicketHistoryQuery = {
    page: query.page ?? 1,

    /**
     * Como el historial mostrado en el panel será una
     * timeline, inicialmente podemos traer hasta 100
     * registros.
     *
     * El backend limita este valor a 100.
     */
    limit: query.limit ?? 100,

    /**
     * Timeline natural:
     *
     * antiguo
     *   ↓
     * nuevo
     */
    ordenDireccion: query.ordenDireccion ?? "asc",

    ...(query.tipo !== undefined && {
      tipo: query.tipo,
    }),

    ...(query.usuarioId !== undefined && {
      usuarioId: query.usuarioId,
    }),

    ...(query.search?.trim() && {
      search: query.search.trim(),
    }),

    ...(query.fechaDesde && {
      fechaDesde: query.fechaDesde,
    }),

    ...(query.fechaHasta && {
      fechaHasta: query.fechaHasta,
    }),
  };

  return crm.useQueryApi<TicketHistoryResponse>(
    ticketHistoryQkeys.ticketWithQuery(normalizedTicketId, resolvedQuery),

    isValidTicketId
      ? crm_endpoints.ticket_historial.by_ticket(normalizedTicketId)
      : crm_endpoints.ticket_historial.by_ticket(0),

    {
      params: resolvedQuery,
    },

    {
      enabled: isValidTicketId,

      /**
       * El historial no cambia constantemente.
       *
       * Después de editar invalidaremos esta query
       * explícitamente.
       */
      staleTime: 1000 * 30,

      /**
       * Si cerramos un ticket y posteriormente volvemos
       * a abrirlo, React Query puede reutilizar la cache.
       */
      gcTime: 1000 * 60 * 5,

      refetchOnWindowFocus: false,

      retry: 1,
    },
  );
}
