import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { serviciosWifiQkeys } from "./Qk";
import { ServiciosInternet } from "@/Crm/features/cliente-interfaces/cliente-types";

export function useGetServiciosWifi() {
  return useCrmQuery<ServiciosInternet[]>(
    serviciosWifiQkeys.all,
    `servicio-internet/get-services-to-customer`,
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
