import { FindClientHistoryQuery } from "./query-cliente-whatsapp.query";
import { useBotQuery } from "@/hooks/hookBot/useBotHook";
import { clienteHistorialWhatsappQkeys } from "./Qk";
import { ClientHistoryResponse } from "@/Crm/features/bot-server/cliente-whatsapp-historial/cliente-historial-chat.interface";

export function useGetClienteHistorialChatsWz(
  id: number,
  q: FindClientHistoryQuery
) {
  return useBotQuery<ClientHistoryResponse>(
    clienteHistorialWhatsappQkeys.chats(q),
    `whatsapp-chat/cliente/${id}`,
    {
      params: q,
    },
    {
      staleTime: 0,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
  );
}
// export const getClienteHistorial = async (
//   clienteId: number,
//   page: number = 1
// ): Promise<ClientHistoryResponse> => {
//   const response = await axios.get<ClientHistoryResponse>(
//     `/api/chat/cliente-historial/${clienteId}`,
//     {
//       params: {
//         page,
//         limit: 20,
//       },
//     }
//   );

//   return response.data;
// };
