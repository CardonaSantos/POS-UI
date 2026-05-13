import { useBotQuery } from "@/hooks/hookBot/useBotHook";

import { ClienteWhatsAppQkeys } from "./Qk";
import { FindClientesQuery } from "@/Crm/features/bot-server/whatsapp-messages/query";
import { ClientesPaginatedResponse } from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";

export function useGetClientes(params: FindClientesQuery) {
  return useBotQuery<ClientesPaginatedResponse>(
    ClienteWhatsAppQkeys.list(params),
    `cliente/get-all`,
    { params },
    undefined,
  );
}
