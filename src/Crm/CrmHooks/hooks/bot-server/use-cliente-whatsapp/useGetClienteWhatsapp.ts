import { FindClientHistoryQuery } from "./query-cliente-whatsapp.query";
import { useBotMutation, useBotQuery } from "@/hooks/hookBot/useBotHook";
import { clienteHistorialWhatsappQkeys } from "./Qk";
import { ClientHistoryResponse } from "@/Crm/features/bot-server/cliente-whatsapp-historial/cliente-historial-chat.interface";
import { bot_server_endpoints } from "../api/bot-server-endpoints";

export interface payloadUpdate {
  nombre: string;
  id: number;
}

export function useGetClienteHistorialChatsWz(
  id: number,
  q: FindClientHistoryQuery,
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
    },
  );
}

/**
 * TOGGEAR EL BOT
 * @param id
 * @returns
 */

export function useToggleBotClientex() {
  // Nota: Usamos POST porque así lo definiste en el controlador NestJS (@Post('toggle-bot'))
  return useBotMutation<
    { ok: boolean },
    { clienteId: number; active: boolean }
  >("post", `agent/chat/toggle-bot`);
}

/**
 * TOGGEAR EL BOT
 * @param id
 * @returns
 */

export function useUpdateClienteBot(id: number) {
  return useBotMutation<void, payloadUpdate>(
    "patch",
    bot_server_endpoints.cliente(id),
  );
}
