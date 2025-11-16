import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { departamentosQKey } from "./Qk";
import { Departamentos } from "@/Crm/features/locations-interfaces/municipios_departamentos.interfaces";

export function useGetDepartamentos() {
  return useCrmQuery<Departamentos[]>(
    departamentosQKey.all,
    `location/get-all-departamentos`,
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
  );
}
