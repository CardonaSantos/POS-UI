import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { instalacionesQkeys } from "../instalaciones/qk";
import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import { pppoeAuditoriaInstalacionQkeys } from "../pppoe-auditoria/qk";
import { pppoeCuentasQkeys } from "../pppoe-cuentas/qk";
import { pppoeAdministracionQkeys } from "./qk";
import { PerfilHomologacionSeleccionable } from "@/Crm/features/pppoe-homologaciones/intefaces";
import {
  AccionManualCuentaPppoePayload,
  ActivarPppoeInstalacionPayload,
  ActivarPppoeInstalacionResponse,
  AutorizarPppoeOperacionPayload,
  EjecutarOperacionPppoeResponse,
} from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.interfaces";

export type ReintentarPppoeOperacionPayload = {
  empresaId: number;

  claveIdempotencia: string;

  motivo?: string | null;
};

export function buildPppoeRetryIdempotencyKey(operacionId: number) {
  return ["pppoe-reintento", operacionId, crypto.randomUUID()].join(":");
}

function useInvalidatePppoeAdministration() {
  const invalidate = useInvalidateQk();

  return () => {
    invalidate(instalacionesQkeys.all);

    invalidate(pppoeAuditoriaInstalacionQkeys.all);

    invalidate(pppoeAdministracionQkeys.all);

    /**
     * Nuevo recurso administrativo.
     *
     * Suspender/reactivar/reintentar pueden modificar:
     *
     * - estadoCuenta
     * - estadoAcceso
     * - ultimaOperacion
     * - acciones disponibles
     * - fechas operativas
     */
    invalidate(pppoeCuentasQkeys.all);
  };
}

export function useGetPerfilesHomologacionSeleccionables(enabled = true) {
  return crm.useQueryApi<PerfilHomologacionSeleccionable[]>(
    pppoeAdministracionQkeys.homologaciones(),
    crm_endpoints.pppoe.pppoe_perfil_homologacion_seleccionables,
    undefined,
    { enabled },
  );
}

export function usePostActivarPppoeInstalacion(instalacionId: number) {
  const invalidate = useInvalidatePppoeAdministration();

  return crm.useMutationApi<
    ActivarPppoeInstalacionResponse,
    ActivarPppoeInstalacionPayload
  >(
    "post",
    crm_endpoints.pppoe.post_activar_instalacion(instalacionId),
    undefined,
    { onSuccess: invalidate },
  );
}

export function usePostSuspenderCuentaPppoe(cuentaPppoeId: number) {
  const invalidate = useInvalidatePppoeAdministration();

  return crm.useMutationApi<
    EjecutarOperacionPppoeResponse,
    AccionManualCuentaPppoePayload
  >(
    "post",
    crm_endpoints.pppoe.post_suspender_cuenta(cuentaPppoeId),
    undefined,
    { onSuccess: invalidate },
  );
}

export function usePostReactivarCuentaPppoe(cuentaPppoeId: number) {
  const invalidate = useInvalidatePppoeAdministration();

  return crm.useMutationApi<
    EjecutarOperacionPppoeResponse,
    AccionManualCuentaPppoePayload
  >(
    "post",
    crm_endpoints.pppoe.post_reactivar_cuenta(cuentaPppoeId),
    undefined,
    { onSuccess: invalidate },
  );
}

export function usePostReintentarPppoeOperacion(operacionId: number) {
  const invalidate = useInvalidatePppoeAdministration();

  return crm.useMutationApi<
    EjecutarOperacionPppoeResponse,
    ReintentarPppoeOperacionPayload
  >(
    "post",
    crm_endpoints.pppoe.post_reintentar_operacion(operacionId),
    undefined,
    {
      onSuccess: invalidate,
    },
  );
}

export function usePostAutorizarOperacionPppoe(operacionId: number) {
  const invalidate = useInvalidatePppoeAdministration();

  return crm.useMutationApi<
    EjecutarOperacionPppoeResponse,
    AutorizarPppoeOperacionPayload
  >(
    "post",
    crm_endpoints.pppoe.post_autorizar_operacion(operacionId),
    undefined,
    { onSuccess: invalidate },
  );
}
