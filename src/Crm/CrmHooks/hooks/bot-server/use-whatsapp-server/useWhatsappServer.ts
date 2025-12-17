import { useBotQuery } from "@/hooks/hookBot/useBotHook";

import { ClienteWhatsAppQkeys } from "./Qk";
import { FindClientesQuery } from "@/Crm/features/bot-server/whatsapp-messages/query";
import { ClientesPaginatedResponse } from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";

export function useGetClientes(params: FindClientesQuery) {
  return useBotQuery<ClientesPaginatedResponse>(
    ClienteWhatsAppQkeys.list(params),
    `cliente/get-all`,
    { params },
    {
      staleTime: 0,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
      // si tu wrapper usa react-query: evita flicker paginando
      // keepPreviousData: true,
    }
  );
}
// export function useUpdateKnowledge(kId: number) {
//   const queryClient = useQueryClient();
//   return useBotMutation<void, KnowledgeDocumentUpdate>(
//     "patch",
//     `knowledge/${kId}`,
//     undefined,
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({
//           queryKey: KnowledgeQkeys.all,
//         });
//       },
//     }
//   );
// }

// export function useCreateKnowledge() {
//   const queryClient = useQueryClient();
//   return useBotMutation<void, KnowledgeCreateType>(
//     "post",
//     `knowledge`,
//     undefined,
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({
//           queryKey: KnowledgeQkeys.all,
//         });
//       },
//     }
//   );
// }

// export function useDeleteKnowledge(kId: number) {
//   const queryClient = useQueryClient();
//   return useBotMutation<void, void>("delete", `knowledge/${kId}`, undefined, {
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: KnowledgeQkeys.all,
//       });
//     },
//   });
// }
