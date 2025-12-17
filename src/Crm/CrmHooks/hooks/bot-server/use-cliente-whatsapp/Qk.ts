import { FindClientHistoryQuery } from "./query-cliente-whatsapp.query";

export const clienteHistorialWhatsappQkeys = {
  all: ["cliente-historial-whatsapp"] as const,

  chats: (params: FindClientHistoryQuery) =>
    ["cliente-historial-whatsapp", params] as const,

  //   detail: (id: number) => ["cliente-historial-whatsapp", "detail", id] as const,
};
