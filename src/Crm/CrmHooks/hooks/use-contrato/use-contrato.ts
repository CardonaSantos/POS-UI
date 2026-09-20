import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { contratoQkeys, PlantillaQkeys } from "./qk";
import { TipoPlantillaLegal } from "@/Crm/features/plantillas-legales/plantillas-legales.interfaces";
import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { ContratoInstalacionVistaResponse } from "@/Crm/features/plantilla-contratos/plantilla-contratos";

export interface CreatePlantillaLegalPayload {
  tipo: TipoPlantillaLegal;
  nombre: string;
  contenido: string;
  version: string;
  activa?: boolean;
}

export interface HtmlContent {
  plantillaId: number;
  creditoId: number;
  html: string;
}

export interface PlantillaesLegales {
  id: number;
  tipo: TipoPlantillaLegal;
  nombre: string;
  contenido: string;
  version: string;
  activa: boolean;
  creatoEn: string;
  actualizadoEn: string;
}

export function useCreatePlantillaLegal() {
  const queryClient = useQueryClient();

  return useCrmMutation<CreatePlantillaLegalPayload>(
    "post",
    "plantillas-legales",
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: contratoQkeys.all,
        });
      },
    },
  );
}

export function useGetContratos() {
  const queryClient = useQueryClient();

  return useCrmMutation<CreatePlantillaLegalPayload>(
    "post",
    "plantillas-legales",
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: contratoQkeys.all,
        });
      },
    },
  );
}

export function useGetHtml(plantillaId: number, creditoId: number) {
  return useCrmQuery<HtmlContent>(
    PlantillaQkeys.all,
    `plantillas-legales/${creditoId}/${plantillaId}`,
    undefined,
    {
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

export function useGetHtmls() {
  return useCrmQuery<Array<PlantillaesLegales>>(
    PlantillaQkeys.all,
    `plantillas-legales`,
    undefined,
    {
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

/**
 * Obtiene la información necesaria para generar
 * el contrato correspondiente a una instalación.
 */
export function useGetContratoInstalacion(
  instalacionId: number,
  plantillaId: number,
) {
  return crm.useQueryApi<ContratoInstalacionVistaResponse>(
    contratoQkeys.instalacion(instalacionId, plantillaId),
    crm_endpoints.contrato.contrato_instalacion(instalacionId, plantillaId),
  );
}
