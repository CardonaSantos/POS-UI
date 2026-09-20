"use client";

import { useQueryClient } from "@tanstack/react-query";

import { crm } from "@/Crm/API/crmApi";
import {
  CrearTicketConformidadResponse,
  GenerarEnlaceTicketConformidadPayload,
  GenerarEnlaceTicketConformidadResponse,
  RegistrarFirmaClienteResponse,
  RegistrarFirmaTecnicoResponse,
  RequerirRetrabajoResponse,
  TicketConformidadDetalle,
  TicketConformidadPublicaResponse,
} from "@/Crm/features/ticket-soporte-conformidad/ticket-soporte-conformidad.types";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { ticketConformidadQkeys } from "./qk";

/* =========================================================
 * CRM
 * ======================================================= */

/**
 * Obtiene únicamente la conformidad más reciente del ticket.
 *
 * Se recomienda habilitarla sólo cuando el dialog de
 * conformidad esté abierto.
 *
 * IMPORTANTE:
 * Si el ticket todavía no posee conformidad, backend
 * responde 404. El componente interpretará ese 404 como
 * estado NONE.
 */
export function useGetConformidadActual(ticketId: number, enabled: boolean) {
  const validTicketId = Number.isInteger(ticketId) && ticketId > 0;

  const canQuery = enabled && validTicketId;

  return crm.useQueryApi<TicketConformidadDetalle>(
    ticketConformidadQkeys.actualByTicket(ticketId),

    validTicketId
      ? crm_endpoints.ticket_conformidad.actualPorTicket(ticketId)
      : "",

    undefined,

    {
      enabled: canQuery,
      staleTime: 0,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
}

/**
 * Crea un nuevo ciclo PENDIENTE para el ticket.
 *
 * El backend obtiene creadoPorId desde JWT.
 * No enviamos body.
 */
export function useCrearTicketConformidad(ticketId: number) {
  const queryClient = useQueryClient();

  return crm.useMutationApi<CrearTicketConformidadResponse, void>(
    "post",

    crm_endpoints.ticket_conformidad.crearPorTicket(ticketId),

    undefined,

    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ticketConformidadQkeys.actualByTicket(ticketId),
        });
      },
    },
  );
}

/**
 * Genera un nuevo token/enlace para una conformidad
 * PENDIENTE existente.
 */
export function useGenerarEnlaceTicketConformidad(
  conformidadId: number | null,
  ticketId: number,
) {
  const queryClient = useQueryClient();

  const endpoint =
    conformidadId !== null &&
    Number.isInteger(conformidadId) &&
    conformidadId > 0
      ? crm_endpoints.ticket_conformidad.generarEnlace(conformidadId)
      : "";

  return crm.useMutationApi<
    GenerarEnlaceTicketConformidadResponse,
    GenerarEnlaceTicketConformidadPayload
  >(
    "post",

    endpoint,

    undefined,

    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ticketConformidadQkeys.actualByTicket(ticketId),
        });

        if (conformidadId !== null) {
          queryClient.invalidateQueries({
            queryKey: ticketConformidadQkeys.detalle(conformidadId),
          });
        }
      },
    },
  );
}

/**
 * Detalle enriquecido de una conformidad concreta.
 *
 * Este hook NO es necesario para el dialog básico,
 * pero dejamos disponible el endpoint tipado.
 */
export function useGetConformidadDetalle(
  conformidadId: number | null,
  enabled = true,
) {
  const canQuery =
    enabled &&
    conformidadId !== null &&
    Number.isInteger(conformidadId) &&
    conformidadId > 0;

  return crm.useQueryApi<TicketConformidadDetalle>(
    canQuery
      ? ticketConformidadQkeys.detalle(conformidadId)
      : [...ticketConformidadQkeys.all, "detalle-disabled"],

    canQuery && conformidadId !== null
      ? crm_endpoints.ticket_conformidad.detalle(conformidadId)
      : "",

    undefined,

    {
      enabled: canQuery,

      staleTime: 0,

      refetchOnWindowFocus: false,

      retry: false,
    },
  );
}

/* =========================================================
 * PÚBLICO
 * ======================================================= */

/**
 * Carga los datos mínimos de la página pública.
 *
 * Este endpoint no necesita JWT.
 */
export function useGetConformidadPublica(token: string | null, enabled = true) {
  const normalizedToken = token?.trim() ?? "";

  const canQuery = enabled && normalizedToken.length > 0;

  return crm.useQueryApi<TicketConformidadPublicaResponse>(
    canQuery
      ? ticketConformidadQkeys.publicByToken(normalizedToken)
      : [...ticketConformidadQkeys.all, "public-disabled"],

    canQuery
      ? crm_endpoints.ticket_conformidad.public.detalle(normalizedToken)
      : "",

    undefined,

    {
      enabled: canQuery,

      staleTime: 0,

      refetchOnWindowFocus: false,

      retry: false,
    },
  );
}

/**
 * Respuesta pública:
 *
 * NO → REQUIERE_RETRABAJO
 */
export function useRequerirRetrabajoTicketConformidad(token: string) {
  const normalizedToken = token.trim();

  return crm.useMutationApi<RequerirRetrabajoResponse, void>(
    "post",

    crm_endpoints.ticket_conformidad.public.retrabajo(normalizedToken),

    undefined,

    undefined,
  );
}

/**
 * Respuesta pública:
 *
 * SÍ → nombre + teléfono + firma.
 *
 * El payload del mutation es directamente FormData porque
 * FileInterceptor('firma') espera multipart/form-data.
 */
export function useRegistrarFirmaClienteTicketConformidad(token: string) {
  const normalizedToken = token.trim();

  return crm.useMutationApi<RegistrarFirmaClienteResponse, FormData>(
    "post",

    crm_endpoints.ticket_conformidad.public.firma(normalizedToken),

    undefined,

    undefined,
  );
}

export function useRegistrarFirmaTecnico(
  conformidadId: number | null,
  ticketId: number,
) {
  const queryClient = useQueryClient();

  const endpoint =
    conformidadId !== null &&
    Number.isInteger(conformidadId) &&
    conformidadId > 0
      ? crm_endpoints.ticket_conformidad.firmaTecnico(conformidadId)
      : "";

  return crm.useMutationApi<RegistrarFirmaTecnicoResponse, FormData>(
    "post",

    endpoint,

    undefined,

    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ticketConformidadQkeys.actualByTicket(ticketId),
        });

        if (conformidadId !== null) {
          queryClient.invalidateQueries({
            queryKey: ticketConformidadQkeys.detalle(conformidadId),
          });
        }
      },
    },
  );
}
