import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";

import { pppoeCuentasQkeys } from "../pppoe-cuentas/qk";
import {
  PppoeCuentaOperacionesParams,
  PppoeOperacionDetalle,
  PppoeOperacionesListResponse,
} from "@/Crm/features/pppoe-operaciones/pppoe-operaciones.interfaces";
import { EjecutarOperacionPppoeResponse } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.interfaces";
import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import { useCallback } from "react";

export type ReintentarPppoeOperacionCuentaPayload = {
  empresaId: number;

  claveIdempotencia: string;

  motivo?: string;
};

export type RecuperarPppoeOperacionCuentaPayload = {
  empresaId: number;

  confirmarAbandono: true;

  fecha?: string;
};

/**
 * No tocamos crm_endpoints.pppoe.get_operacion existente.
 *
 * Ese helper pertenece al flujo anterior y todavía puede
 * tener la firma:
 *
 * get_operacion(operacionId, empresaId)
 *
 * Para el recurso administrativo nuevo utilizamos el
 * contrato actual del servidor, donde empresaId procede
 * del JWT.
 */
function getPppoeOperacionDetalleEndpoint(operacionId: number) {
  return `/pppoe-operaciones/${operacionId}`;
}

/**
 * Historial técnico de una cuenta concreta.
 *
 * GET /pppoe-operaciones?cuentaPppoeId=:id
 */
export function useGetPppoeOperacionesCuenta(
  cuentaPppoeId: number,

  params: PppoeCuentaOperacionesParams = {
    page: 1,

    limit: 20,

    ordenPor: "creadoEn",

    ordenDireccion: "desc",
  },

  enabled = true,
) {
  const canQuery =
    enabled && Number.isInteger(cuentaPppoeId) && cuentaPppoeId > 0;

  const queryParams = {
    ...params,

    cuentaPppoeId,
  };

  /**
   * Incluimos params en el queryKey.
   *
   * Esto es importante porque posteriormente podremos
   * paginar/filtrar sin compartir accidentalmente cache
   * entre page=1, page=2, etc.
   */
  const queryKey = [
    ...pppoeCuentasQkeys.operations(cuentaPppoeId),

    queryParams,
  ] as const;

  return crm.useQueryApi<PppoeOperacionesListResponse>(
    queryKey,

    crm_endpoints.pppoe.get_operaciones_paginated,

    {
      params: queryParams,
    },

    {
      enabled: canQuery,
    },
  );
}

/**
 * Detalle técnico completo de una operación.
 *
 * Incluye:
 *
 * - relaciones;
 * - snapshots;
 * - resultado;
 * - pasos técnicos;
 * - cadena de reintentos.
 *
 * GET /pppoe-operaciones/:operacionId
 */
export function useGetPppoeOperacionDetalle(
  cuentaPppoeId: number,

  operacionId: number,

  enabled = true,
) {
  const canQuery =
    enabled &&
    Number.isInteger(cuentaPppoeId) &&
    cuentaPppoeId > 0 &&
    Number.isInteger(operacionId) &&
    operacionId > 0;

  return crm.useQueryApi<PppoeOperacionDetalle>(
    pppoeCuentasQkeys.operationDetail(cuentaPppoeId, operacionId),

    getPppoeOperacionDetalleEndpoint(operacionId),

    undefined,

    {
      enabled: canQuery,
    },
  );
}

function useInvalidatePppoeOperacionCuenta(cuentaPppoeId: number) {
  const invalidate = useInvalidateQk();

  return useCallback(() => {
    /**
     * Refresca el detalle principal.
     *
     * Esto actualiza:
     * - ultimaOperacion
     * - acciones.reintentarOperacion
     * - acciones.recuperarOperacion
     * - estadoCuenta
     * - conteos
     */
    invalidate(pppoeCuentasQkeys.detail(cuentaPppoeId));

    /**
     * Refresca también cualquier listado general.
     */
    invalidate(pppoeCuentasQkeys.lists());
  }, [cuentaPppoeId, invalidate]);
}

/**
 * POST /pppoe-operaciones/:operacionId/reintentar
 */
export function usePostReintentarPppoeOperacionCuenta(
  cuentaPppoeId: number,
  operacionId: number,
) {
  const invalidate = useInvalidatePppoeOperacionCuenta(cuentaPppoeId);

  return crm.useMutationApi<
    EjecutarOperacionPppoeResponse,
    ReintentarPppoeOperacionCuentaPayload
  >(
    "post",

    crm_endpoints.pppoe.post_reintentar_operacion(operacionId),

    undefined,

    {
      onSuccess: invalidate,
    },
  );
}

/**
 * POST /pppoe-operaciones/:operacionId/recuperar
 *
 * Recuperar NO repite comandos SSH.
 * Cierra una operación EJECUTANDO que quedó
 * abandonada/interrumpida.
 */
export function usePostRecuperarPppoeOperacionCuenta(
  cuentaPppoeId: number,
  operacionId: number,
) {
  const invalidate = useInvalidatePppoeOperacionCuenta(cuentaPppoeId);

  return crm.useMutationApi<
    EjecutarOperacionPppoeResponse,
    RecuperarPppoeOperacionCuentaPayload
  >(
    "post",

    crm_endpoints.pppoe.post_recuperar_operacion(operacionId),

    undefined,

    {
      onSuccess: invalidate,
    },
  );
}
