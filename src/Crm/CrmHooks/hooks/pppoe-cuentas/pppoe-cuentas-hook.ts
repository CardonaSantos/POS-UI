import { useCallback } from "react";

import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";

import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";

import type { FiltrarPppoeCuentasParams } from "@/Crm/features/pppoe-cuentas/pppoe-cuentas.filters";

import type { PppoeCuentaDetalle } from "@/Crm/features/pppoe-cuentas/pppoe-cuenta-detalle.interfaces";

import type { PppoeCuentasListResponse } from "@/Crm/features/pppoe-cuentas/pppoe-cuentas.interfaces";

import type { EjecutarOperacionPppoeResponse } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.interfaces";

import type { EstadoCuentaPppoe } from "@/Crm/features/instalaciones/enums";

import { pppoeCuentasQkeys } from "./qk";
import {
  CrearPrealtaPppoeCuentaPayload,
  CrearPrealtaPppoeCuentaResponse,
} from "@/Crm/features/pppoe-cuentas/pppoe-prealta.interfaces";

export type RevelarCredencialesPppoeCuentaResponse = {
  cuentaPppoeId: number;

  usuario: string;

  contrasena: string;
};

export type ProvisionarPppoeCuentaPayload = {
  contrasenaActual: string;

  motivo?: string;
};

export type ProvisionarPppoeCuentaResponse = {
  cuentaPppoeId: number;

  completada: boolean;

  estadoCuenta: EstadoCuentaPppoe | null;

  /**
   * Puede ser null cuando la creación del secret
   * ya fue resuelta por una recuperación/reintento previo.
   */
  creacionSecret: EjecutarOperacionPppoeResponse | null;

  /**
   * null cuando no fue posible continuar hasta
   * ACTIVAR_SECRET.
   */
  activacion: EjecutarOperacionPppoeResponse | null;
};

/**
 * Invalida únicamente el recurso afectado:
 *
 * - todos los listados de cuentas;
 * - el detalle concreto.
 *
 * Las futuras queries hijas del detail, como
 * operations(cuentaPppoeId), también quedan cubiertas
 * por la invalidación del prefijo detail.
 */
export function useInvalidatePppoeCuenta(cuentaPppoeId: number) {
  const invalidate = useInvalidateQk();

  return useCallback(() => {
    invalidate(pppoeCuentasQkeys.lists());

    if (Number.isInteger(cuentaPppoeId) && cuentaPppoeId > 0) {
      invalidate(pppoeCuentasQkeys.detail(cuentaPppoeId));
    }
  }, [cuentaPppoeId, invalidate]);
}

/**
 * GET /pppoe-cuentas
 */
export function useGetPppoeCuentas(
  params: FiltrarPppoeCuentasParams,
  enabled = true,
) {
  return crm.useQueryApi<PppoeCuentasListResponse>(
    pppoeCuentasQkeys.list(params),

    crm_endpoints.pppoe.get_cuentas_paginated,

    {
      params,
    },

    {
      enabled,
    },
  );
}

/**
 * GET /pppoe-cuentas/:cuentaPppoeId
 */
export function useGetPppoeCuentaDetalle(
  cuentaPppoeId: number,
  enabled = true,
) {
  const canQuery =
    enabled && Number.isInteger(cuentaPppoeId) && cuentaPppoeId > 0;

  return crm.useQueryApi<PppoeCuentaDetalle>(
    pppoeCuentasQkeys.detail(cuentaPppoeId),

    crm_endpoints.pppoe.get_cuenta(cuentaPppoeId),

    undefined,

    {
      enabled: canQuery,
    },
  );
}

/**
 * POST /pppoe-cuentas/:cuentaPppoeId/provisionar
 *
 * Ejecuta el alta manual real:
 *
 * CREAR_SECRET
 *      ↓
 * ACTIVAR_SECRET
 */
export function usePostProvisionarPppoeCuenta(cuentaPppoeId: number) {
  const invalidate = useInvalidatePppoeCuenta(cuentaPppoeId);

  return crm.useMutationApi<
    ProvisionarPppoeCuentaResponse,
    ProvisionarPppoeCuentaPayload
  >(
    "post",

    crm_endpoints.pppoe.post_provisionar_cuenta(cuentaPppoeId),

    undefined,

    {
      onSuccess: invalidate,
    },
  );
}

/**
 * POST /pppoe-cuentas/prealta
 *
 * Prepara administrativamente una cuenta PPPoE.
 *
 * IMPORTANTE:
 * todavía NO ejecuta comandos contra MikroTik.
 *
 * Después de una respuesta correcta normalmente
 * navegaremos hacia:
 *
 * /crm/pppoe/cuentas/:cuentaPppoeId
 *
 * para ejecutar posteriormente "Provisionar".
 */
export function usePostCrearPrealtaPppoeCuenta() {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    CrearPrealtaPppoeCuentaResponse,
    CrearPrealtaPppoeCuentaPayload
  >(
    "post",

    crm_endpoints.pppoe.post_prealta_cuenta,

    undefined,

    {
      onSuccess: () => {
        /**
         * Puede aparecer inmediatamente una cuenta nueva
         * en cualquier listado administrativo abierto.
         */
        invalidate(pppoeCuentasQkeys.lists());
      },
    },
  );
}

/**
 * POST /pppoe-cuentas/:cuentaPppoeId/revelar-credenciales
 *
 * Descifra temporalmente las credenciales PPPoE
 * de una cuenta concreta.
 *
 * Se utiliza una mutación porque:
 *
 * - el endpoint es POST;
 * - la visualización genera auditoría;
 * - la contraseña no debe almacenarse como query cache.
 *
 * El consumidor debe llamar mutation.reset()
 * al cerrar el diálogo.
 */
export function usePostRevelarCredencialesPppoeCuenta(cuentaPppoeId: number) {
  return crm.useMutationApi<RevelarCredencialesPppoeCuentaResponse, void>(
    "post",

    crm_endpoints.pppoe.post_revelar_credenciales_cuenta(cuentaPppoeId),
  );
}
