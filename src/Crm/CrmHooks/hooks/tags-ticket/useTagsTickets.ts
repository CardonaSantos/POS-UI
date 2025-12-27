import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { tagsTicketsQkeys } from "./Qk";
import { EtiquetaTicket } from "@/Crm/features/tags/tags.interfaces";

export function useGetTagsTicket() {
    return useCrmQuery<Array<EtiquetaTicket>>(
           tagsTicketsQkeys.all,
    `/tags-ticket/get-tags-to-ticket`,
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