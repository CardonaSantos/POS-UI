import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { instalacionesQkeys } from "./qk";
import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import {
  ClienteInstalacionDetalle,
  ClienteInstalacionListResponse,
  CrearClienteInstalacionResponse,
} from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { FiltrarClienteInstalacionesParams } from "@/Crm/features/instalaciones/filter";
import { CrearClienteInstalacionPayload } from "@/Crm/Crm-instalaciones/common/crear-instalacion.payload";
import {
  DetalleInstalacionTecnicaResponse,
  ListarInstalacionesTecnicasAsignadasResponse,
} from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";
import { FiltrarMisInstalacionesAsignadasParams } from "@/Crm/features/instalaciones_tecnico/filters";
import { SubirEvidenciaInstalacionResponse } from "@/Crm/features/instalaciones_tecnico/Subirevidencia-instalacion-response ";
import {
  CancelarInstalacionTecnicaPayload,
  CompletarInstalacionTecnicaPayload,
  IniciarInstalacionTecnicaPayload,
  ReintentarPrealtaPppoePayload,
  ReprogramarInstalacionTecnicaPayload,
} from "@/Crm/features/instalaciones_tecnico/acciones-instalacion.payload";
import { ReintentarPrealtaPppoeResponse } from "@/Crm/features/instalaciones_tecnico/reintentar-prealta.response";
import {
  ActualizarClienteInstalacionPayload,
  ActualizarClienteInstalacionResponse,
} from "@/Crm/features/instalaciones/edicion-instalaciones";

/**
 * LISTAR INSTALACIONES PAGINADAS CON FILTRO
 * @param query
 * @returns
 */
export function useGetInstalacionesPaginated(
  query: FiltrarClienteInstalacionesParams,
) {
  return crm.useQueryApi<ClienteInstalacionListResponse>(
    instalacionesQkeys.list(query),
    crm_endpoints.instalaciones.get_instalaciones_paginated,
    {
      params: query,
    },
    undefined,
  );
}

/**
 * CREAR UNA INSTALACION
 * @returns
 */
export function useCreateInstalacion() {
  const invalidate = useInvalidateQk();
  return crm.useMutationApi<
    CrearClienteInstalacionResponse,
    CrearClienteInstalacionPayload
  >("post", crm_endpoints.instalaciones.post_instalacion, undefined, {
    onSuccess: () => {
      invalidate(instalacionesQkeys.all);
    },
  });
}

/**
 * ACTUALIZAR INSTALACION / REASIGNACION DE TECNICOS Y ENCARGADO
 */
export function usePatchInstalacion(instalacionId: number) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    ActualizarClienteInstalacionResponse,
    ActualizarClienteInstalacionPayload
  >(
    "patch",
    crm_endpoints.instalaciones.patch_instalacion(instalacionId),
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.all);

        invalidate(instalacionesQkeys.specific(instalacionId));
      },
    },
  );
}

/**
 * CONSEGUIR EL DETALLE DE UNA INSTALACION
 * @returns
 */
export function useGetInstalacion(id: number, empresaId: number) {
  return crm.useQueryApi<ClienteInstalacionDetalle>(
    instalacionesQkeys.specific(id),
    crm_endpoints.instalaciones.get_instalacion(id),
    {
      params: {
        empresaId,
      },
    },
    {
      enabled:
        Number.isInteger(id) &&
        id > 0 &&
        Number.isInteger(empresaId) &&
        empresaId > 0,
    },
  );
}

/**
 * Carga una evidencia de imagen para una instalación.
 *
 * El endpoint recibe una imagen por petición.
 */
export function usePostEvidenciaInstalacion(
  instalacionId: number,
  empresaId: number,
) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<SubirEvidenciaInstalacionResponse, FormData>(
    "post",
    crm_endpoints.instalaciones.post_evidencias(instalacionId, empresaId),
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.all);
      },
    },
  );
}

export function useGetInstalacionesTecnicasAsignadas(
  query: FiltrarMisInstalacionesAsignadasParams,
) {
  return crm.useQueryApi<ListarInstalacionesTecnicasAsignadasResponse>(
    instalacionesQkeys.assignedList(query),
    crm_endpoints.instalaciones.get_mis_instalaciones_asignadas,
    {
      params: query,
    },
  );
}

export function useGetDetalleInstalacionTecnica(instalacionId: number) {
  return crm.useQueryApi<DetalleInstalacionTecnicaResponse>(
    instalacionesQkeys.technicalDetail(instalacionId),
    crm_endpoints.instalaciones.get_instalacion_tecnica(instalacionId),
    undefined,
    {
      enabled: Number.isInteger(instalacionId) && instalacionId > 0,
    },
  );
}

export function usePatchReprogramarInstalacionTecnica(instalacionId: number) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    ClienteInstalacionDetalle,
    ReprogramarInstalacionTecnicaPayload
  >(
    "patch",
    crm_endpoints.instalaciones.patch_reprogramar_instalacion(instalacionId),
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.all);
      },
    },
  );
}

export function usePostIniciarInstalacionTecnica(instalacionId: number) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    ClienteInstalacionDetalle,
    IniciarInstalacionTecnicaPayload
  >(
    "post",
    crm_endpoints.instalaciones.post_iniciar_instalacion(instalacionId),
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.all);
      },
    },
  );
}

export function usePostCompletarInstalacionTecnica(instalacionId: number) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    ClienteInstalacionDetalle,
    CompletarInstalacionTecnicaPayload
  >(
    "post",
    crm_endpoints.instalaciones.post_completar_instalacion(instalacionId),
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.all);
      },
    },
  );
}

export function usePostCancelarInstalacionTecnica(instalacionId: number) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    ClienteInstalacionDetalle,
    CancelarInstalacionTecnicaPayload
  >(
    "post",
    crm_endpoints.instalaciones.post_cancelar_instalacion(instalacionId),
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.all);
      },
    },
  );
}

export function usePostReintentarPrealtaPppoe(
  instalacionId: number,
  accesoInternetId: number,
) {
  const invalidate = useInvalidateQk();

  return crm.useMutationApi<
    ReintentarPrealtaPppoeResponse,
    ReintentarPrealtaPppoePayload
  >(
    "post",
    crm_endpoints.pppoe.post_reintentar_prealta(
      instalacionId,
      accesoInternetId,
    ),
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.all);
      },
    },
  );
}
