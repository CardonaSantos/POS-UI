import { crm } from "@/Crm/API/crmApi";

import { crm_endpoints } from "@/Crm/API/routes/endpoints";

import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";

import { pppoeCuentasQkeys } from "./qk";

import type {
  AdoptarCuentaPppoeResponse,
  PppoeAdopcionPayload,
  VerificarAdopcionPppoeResponse,
} from "@/Crm/features/pppoe-cuentas/pppoe-adopcion.interfaces";

/**
 * POST /pppoe-cuentas/adopcion/verificar
 *
 * Comprueba el secret existente directamente contra MikroTik.
 *
 * Esta mutation NO debe invalidar queries porque
 * la verificación no modifica estado local ni remoto.
 */
export function usePostVerificarAdopcionPppoe() {
  return crm.useMutationApi<
    VerificarAdopcionPppoeResponse,
    PppoeAdopcionPayload
  >(
    "post",

    crm_endpoints.pppoe.post_verificar_adopcion_cuenta,
  );
}

/**
 * POST /pppoe-cuentas/adopcion
 *
 * Ejecuta la adopción definitiva.
 *
 * El backend:
 *
 * 1. vuelve a verificar MikroTik;
 * 2. cifra la misma contraseña;
 * 3. crea el acceso;
 * 4. crea la cuenta;
 * 5. registra auditoría.
 *
 * Después de una adopción correcta invalidamos los
 * listados porque inmediatamente existe una nueva
 * cuenta administrativa.
 */
export function usePostAdoptarCuentaPppoe() {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<AdoptarCuentaPppoeResponse, PppoeAdopcionPayload>(
    "post",

    crm_endpoints.pppoe.post_adoptar_cuenta,

    undefined,

    {
      onSuccess: () => {
        invalidate(pppoeCuentasQkeys.lists());
      },
    },
  );
}
