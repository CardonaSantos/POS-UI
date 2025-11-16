import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { zonasFacturacionQkeys } from "./Qk";
import { FacturacionZona } from "@/Crm/features/zonas-facturacion/FacturacionZonaTypes";

export function useGetZonasFacturacion() {
  return useCrmQuery<FacturacionZona[]>(
    zonasFacturacionQkeys.all,
    `facturacion-zona/get-zonas-facturacion-to-customer`,
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
