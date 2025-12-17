import { FindClientesQuery } from "@/Crm/features/bot-server/whatsapp-messages/query";

export const ClienteWhatsAppQkeys = {
  all: ["clientes"] as const,

  list: (params: FindClientesQuery) => ["clientes", "list", params] as const,

  detail: (id: number) => ["clientes", "detail", id] as const,
};
