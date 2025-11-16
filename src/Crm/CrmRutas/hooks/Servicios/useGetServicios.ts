import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { serviciosQkeys } from "./Qk";
import { Servicio } from "@/Crm/features/cliente-interfaces/cliente-types";

export function useGetServicios() {
  return useCrmQuery<Servicio[]>(
    serviciosQkeys.all,
    `servicio/get-servicios-to-customer`,
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
