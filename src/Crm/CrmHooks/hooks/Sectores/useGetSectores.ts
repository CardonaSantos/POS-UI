import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { sectoresQkeys } from "./Qk";
import { Sector } from "@/Crm/features/cliente-interfaces/cliente-types";

export function useGetSectores() {
  return useCrmQuery<Sector[]>(
    sectoresQkeys.all,
    `sector/sectores-to-select`,
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
