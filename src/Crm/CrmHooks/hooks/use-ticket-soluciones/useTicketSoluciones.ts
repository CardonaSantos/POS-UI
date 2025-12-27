import { CreateSolucionTicketDto } from "@/Crm/CrmTickets/CrmUtilidadesSoporte/_components/form/zod";
import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { TicketSolucionesQkeys } from "./Qk";
import { useQueryClient } from "@tanstack/react-query";
import { SolucionTicketItem } from "@/Crm/features/ticket-soluciones/ticket-soluciones.interface";

// POST
export function useCreateTicketSoluciones() {
const query = useQueryClient()
    return useCrmMutation<CreateSolucionTicketDto>( 
        "post", 
        `ticket-soluciones`,
        undefined, {
            onSuccess: ()=> {
            query.invalidateQueries({
                queryKey: TicketSolucionesQkeys.all,
            })
            }
        }
    );
}
// DELETE
export function useDeleteTicketSoluciones(registId:number) {
const query = useQueryClient()
    return useCrmMutation<void, number>( 
        "delete", 
        `ticket-soluciones/${registId}`,
        undefined, {
            onSuccess: ()=> {
            query.invalidateQueries({
                queryKey: TicketSolucionesQkeys.all,
            })
            }
        }
    );
}
// GET
export function useGetTicketSoluciones() {
    return useCrmQuery<SolucionTicketItem[]>(
        TicketSolucionesQkeys.all,
        `ticket-soluciones`,
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
// PATCH
export function useUpdateTicketSoluciones() { 
  const query = useQueryClient();
  return useCrmMutation<Partial<CreateSolucionTicketDto> & { id: number }>( 
    "patch", 
    "ticket-soluciones", 
    undefined, 
    {
      onSuccess: () => {
        query.invalidateQueries({
          queryKey: TicketSolucionesQkeys.all,
        });
      }
    }
  );
}
