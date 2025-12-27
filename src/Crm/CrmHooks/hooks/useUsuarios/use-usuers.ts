import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { usersQkeys } from "./Qk";

interface UsuarioToTicket {
  id: number;
  nombre: string;
}
export function useGetUsersToSelect() {
    return useCrmQuery<Array<UsuarioToTicket>>(
        usersQkeys.all,
        `user/get-users-to-create-tickets`,
        undefined,
          {
            staleTime: 0,
            gcTime: 1000 * 60,
            refetchOnWindowFocus: "always",
            refetchOnMount: "always",
            refetchOnReconnect: "always",
            retry: 1,
            }
    )
}