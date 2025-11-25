import { MikrotikRoutersResponse } from "@/Crm/features/mikro-tiks/mikrotiks.interfaces";
import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { mikroTikQkeys } from "./Qk";

export function useGetMikroTiks() {
  return useCrmQuery<Array<MikrotikRoutersResponse>>(
    mikroTikQkeys.all,
    "/mikro-tik",
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
