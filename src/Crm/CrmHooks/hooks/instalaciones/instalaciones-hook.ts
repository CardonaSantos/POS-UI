import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { instalacionesQkeys } from "./qk";
import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import {
  ClienteInstalacionDetalle,
  ClienteInstalacionListResponse,
} from "@/Crm/features/instalaciones/instalaciones.interfaces";
import { CrearClienteInstalacionPayload } from "@/Crm/features/instalaciones/crear-instalacion.payload";
import { FiltrarClienteInstalacionesParams } from "@/Crm/features/instalaciones/filter";

/**
 * LISTAR INSTALACIONES PAGINADAS CON FILTRO
 * @param query
 * @returns
 */
export function useGetInstalacionesPaginated(
  query: FiltrarClienteInstalacionesParams,
) {
  return crm.useQueryApi<ClienteInstalacionListResponse>(
    instalacionesQkeys.all,
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
  return crm.useMutationApi<CrearClienteInstalacionPayload>(
    "post",
    crm_endpoints.instalaciones.post_instalacion,
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.all);
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
        empresaId: empresaId,
      },
    },
    undefined,
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

  return crm.useMutationApi<FormData>(
    "post",
    crm_endpoints.instalaciones.post_evidencias(instalacionId, empresaId),
    undefined,
    {
      onSuccess: () => {
        invalidate(instalacionesQkeys.specific(instalacionId));
      },
    },
  );
}
