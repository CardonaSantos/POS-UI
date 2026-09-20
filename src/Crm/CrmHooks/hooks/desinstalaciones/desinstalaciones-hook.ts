import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";

import type { FiltrarClienteDesinstalacionesParams } from "@/Crm/features/desinstalaciones/filter";

import type { ClienteDesinstalacionListResponse } from "@/Crm/features/desinstalaciones/desinstalaciones.interfaces";

import { desinstalacionesQkeys } from "./qk";
import { ClienteDesinstalacionDetalle } from "@/Crm/features/desinstalaciones/desinstalacion-detalle.interfaces";
import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import { SubirEvidenciaDesinstalacionResponse } from "@/Crm/features/desinstalaciones/desinstalaciones-evidencia-response";
import { ContextoCreacionDesinstalacionResponse } from "@/Crm/features/desinstalaciones/contexto-creacion.interfaces";
import {
  CrearDesinstalacionPayload,
  CrearDesinstalacionResponse,
} from "@/Crm/features/desinstalaciones/crear-desinstalacion.payload";
import {
  SolicitarAutorizacionDesinstalacionPayload,
  SolicitarAutorizacionDesinstalacionResponse,
} from "@/Crm/features/desinstalaciones/solicitar-autorizacion-desinstalacion.payload";
import {
  AprobarAutorizacionDesinstalacionPayload,
  AutorizacionDecisionResponse,
  AutorizacionesPendientesQueryParams,
  AutorizacionesPendientesResponse,
  RechazarAutorizacionDesinstalacionPayload,
} from "@/Crm/features/desinstalaciones/auth/autorizaciones-desinstalacion.interfaces";

export function useGetDesinstalacionesPaginated(
  query: FiltrarClienteDesinstalacionesParams,
) {
  const empresaIdValida =
    Number.isInteger(query.empresaId) && query.empresaId > 0;
  return crm.useQueryApi<ClienteDesinstalacionListResponse>(
    desinstalacionesQkeys.list(query),

    crm_endpoints.desinstalaciones.get_desinstalaciones_paginated,
    {
      params: query,
    },
    {
      enabled: empresaIdValida,
    },
  );
}

export function useGetDesinstalacionDetalle(desinstalacionId: number) {
  const idValido = Number.isInteger(desinstalacionId) && desinstalacionId > 0;

  return crm.useQueryApi<ClienteDesinstalacionDetalle>(
    desinstalacionesQkeys.specific(desinstalacionId),

    crm_endpoints.desinstalaciones.get_desinstalacion(desinstalacionId),

    {},

    {
      enabled: idValido,
    },
  );
}

/**
 * Carga una evidencia para una desinstalación.
 *
 * El endpoint recibe un archivo por petición.
 * El manejo de múltiples evidencias se realiza
 * secuencialmente desde la UI.
 */
export function usePostEvidenciaDesinstalacion(desinstalacionId: number) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<SubirEvidenciaDesinstalacionResponse, FormData>(
    "post",

    crm_endpoints.desinstalaciones.post_evidencias(desinstalacionId),

    undefined,

    {
      onSuccess: () => {
        invalidate(desinstalacionesQkeys.all);
      },
    },
  );
}

// contexto
export function useGetContextoCreacionDesinstalacion(
  clienteId: number | null | undefined,
) {
  const clienteIdValido =
    typeof clienteId === "number" &&
    Number.isInteger(clienteId) &&
    clienteId > 0;

  const resolvedClienteId = clienteIdValido ? clienteId : 0;

  return crm.useQueryApi<ContextoCreacionDesinstalacionResponse>(
    desinstalacionesQkeys.contextoCreacion(resolvedClienteId),

    crm_endpoints.desinstalaciones.get_contexto_creacion(resolvedClienteId),

    undefined,

    {
      enabled: clienteIdValido,
    },
  );
}

// crear desinstalacion
export function useCreateDesinstalacion() {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    CrearDesinstalacionResponse,
    CrearDesinstalacionPayload
  >(
    "post",

    crm_endpoints.desinstalaciones.post_desinstalacion,

    undefined,

    {
      onSuccess: () => {
        invalidate(desinstalacionesQkeys.all);
      },
    },
  );
}

// solicitar auth
export function useSolicitarAutorizacionDesinstalacion(
  desinstalacionId: number,
) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    SolicitarAutorizacionDesinstalacionResponse,
    SolicitarAutorizacionDesinstalacionPayload
  >(
    "post",

    crm_endpoints.desinstalaciones.post_solicitar_autorizacion(
      desinstalacionId,
    ),

    undefined,

    {
      onSuccess: () => {
        /**
         * Refresca listado de desinstalaciones.
         */
        invalidate(desinstalacionesQkeys.all);

        /**
         * Refresca cualquier página cacheada
         * de autorizaciones pendientes.
         */
        invalidate(desinstalacionesQkeys.autorizacionesPendientesRoot());
      },
    },
  );
}

/**
 * Conseguir las autorizaciones pendientes
 * @param params
 * @returns
 */
export function useGetAutorizacionesDesinstalacionPendientes(
  params: AutorizacionesPendientesQueryParams,
) {
  return crm.useQueryApi<AutorizacionesPendientesResponse>(
    desinstalacionesQkeys.autorizacionesPendientes(params),

    crm_endpoints.desinstalaciones.get_autorizaciones_pendientes,
    {
      params: params,
    },
  );
}

// aprobar
export function useAprobarAutorizacionDesinstalacion(autorizacionId: number) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    AutorizacionDecisionResponse,
    AprobarAutorizacionDesinstalacionPayload
  >(
    "patch",

    crm_endpoints.desinstalaciones.patch_aprobar_autorizacion(autorizacionId),

    undefined,

    {
      onSuccess: () => {
        invalidate(desinstalacionesQkeys.autorizacionesPendientesRoot());

        invalidate(desinstalacionesQkeys.all);
      },
    },
  );
}

// rechazar
export function useRechazarAutorizacionDesinstalacion(autorizacionId: number) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    AutorizacionDecisionResponse,
    RechazarAutorizacionDesinstalacionPayload
  >(
    "patch",

    crm_endpoints.desinstalaciones.patch_rechazar_autorizacion(autorizacionId),

    undefined,

    {
      onSuccess: () => {
        invalidate(desinstalacionesQkeys.autorizacionesPendientesRoot());

        invalidate(desinstalacionesQkeys.all);
      },
    },
  );
}
