import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { Municipios } from "@/Crm/features/locations-interfaces/municipios_departamentos.interfaces";
import { municipiosQKey } from "./Qk";

export function useGetMunicipios(departamentoId: number | null) {
  return useCrmQuery<Municipios[]>(
    municipiosQKey.specificMunicipios(departamentoId ?? 0),
    departamentoId ? `location/get-municipio/${departamentoId}` : "",
    undefined,
    {
      enabled: !!departamentoId, // <- clave
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
  );
}
