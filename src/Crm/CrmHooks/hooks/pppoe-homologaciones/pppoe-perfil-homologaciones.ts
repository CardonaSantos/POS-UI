import { crm_endpoints } from "@/Crm/API/routes/endpoints";

import { useInvalidateQk } from "../useInvalidateQk/useInvalidateQk";
import { pppoe_homologacionesQk } from "./Qk";
import {
  ActualizarCodigoPerfilPayload,
  CambiarEstadoPerfilPayload,
  CrearPerfilHomologacionPayload,
  ListarPerfilesHomologacionParams,
  PerfilesHomologacionSeleccionablesResponse,
  PerfilHomologacionPage,
  PerfilHomologacionResponse,
  PerfilHomologacionSelectMeta,
} from "@/Crm/features/pppoe-homologaciones/intefaces";
import { crm } from "@/Crm/API/crmApi";
import { useMemo } from "react";
import { AppSelectOption } from "@/components/app/primitives/app-single-select";

export function usePerfilesHomologacion(
  params: ListarPerfilesHomologacionParams,
  enabled = true,
) {
  return crm.useQueryApi<PerfilHomologacionPage>(
    pppoe_homologacionesQk.search(params),
    crm_endpoints.pppoe.ppoe_perfil_homologacion,
    { params },
    {
      enabled,
      placeholderData: (previousData) => previousData,
    },
  );
}

function useInvalidatePerfilesHomologacion() {
  const invalidateQk = useInvalidateQk();

  return () => {
    invalidateQk(pppoe_homologacionesQk.all);
  };
}

export function useCrearPerfilHomologacion() {
  const invalidate = useInvalidatePerfilesHomologacion();

  return crm.useMutationApi<
    PerfilHomologacionResponse,
    CrearPerfilHomologacionPayload
  >("post", crm_endpoints.pppoe.ppoe_perfil_homologacion, undefined, {
    onSuccess: invalidate,
  });
}

export function useActualizarCodigoPerfil(id: number | null) {
  const invalidate = useInvalidatePerfilesHomologacion();

  return crm.useMutationApi<
    PerfilHomologacionResponse,
    ActualizarCodigoPerfilPayload
  >(
    "patch",
    crm_endpoints.pppoe.ppoe_perfil_homologacion_actualizar_codigo(id ?? 0),
    undefined,
    {
      onSuccess: invalidate,
    },
  );
}

export function useCambiarEstadoPerfil(
  id: number | null,
  action: "activar" | "desactivar",
) {
  const invalidate = useInvalidatePerfilesHomologacion();

  return crm.useMutationApi<
    PerfilHomologacionResponse,
    CambiarEstadoPerfilPayload
  >(
    "patch",
    crm_endpoints.pppoe.ppoe_perfil_homologacion_actualizar_estado(
      id ?? 0,
      action,
    ),
    undefined,
    {
      onSuccess: invalidate,
    },
  );
}

export function useGetHomologacionesSelect() {
  const query = crm.useQueryApi<PerfilesHomologacionSeleccionablesResponse>(
    pppoe_homologacionesQk.all,
    crm_endpoints.pppoe.ppoe_perfil_homologacion_seleccionables,
  );

  const options = useMemo<
    AppSelectOption<number, PerfilHomologacionSelectMeta>[]
  >(
    () =>
      query.data?.map((perfil) => ({
        value: perfil.id,

        label: [
          perfil.codigoPerfil,
          perfil.servicioInternet.nombre,
          perfil.mikrotikRouter.nombre,
        ].join(" · "),

        description: [
          perfil.servicioInternet.velocidad ?? "Velocidad no definida",
          `Q${perfil.servicioInternet.precio}`,
        ].join(" · "),

        meta: {
          codigoPerfil: perfil.codigoPerfil,
          mikrotikRouterId: perfil.mikrotikRouterId,
          servicioInternetId: perfil.servicioInternetId,
        },
      })) ?? [],
    [query.data],
  );

  return {
    ...query,
    data: options,
  };
}
