// query.interface.ts

import {
  WazDirection,
  WazMessageType,
  WazStatus,
} from "@/Crm/features/bot-server/cliente-whatsapp-historial/cliente-historial-chat.interface";

// import { WazDirection } from "@/Crm/features/bot-server/cliente-whatsapp-historial/cliente-historial-chat.interface";

export interface FindClientHistoryQuery {
  search?: string;

  direction?: WazDirection; // 'INBOUND' | 'OUTBOUND'
  status?: WazStatus; // 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
  type?: WazMessageType; // 'TEXT' | 'IMAGE' | 'DOCUMENT' ...

  startDate?: string;
  endDate?: string;

  clienteId?: number;

  // 📄 Paginación
  // Nota: El backend espera 'limit', aunque en la respuesta 'meta' devuelva 'take'.
  // Es estándar enviar 'limit' y recibir 'take'.
  page?: number;
  limit?: number;
}
