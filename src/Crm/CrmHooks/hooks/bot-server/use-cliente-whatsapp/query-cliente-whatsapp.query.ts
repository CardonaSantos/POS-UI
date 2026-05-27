import { WazMessageType } from "@/Crm/features/bot-server/cliente-whatsapp-historial/cliente-historial-chat.interface";
import {
  WazDirection,
  WazStatus,
} from "@/Crm/features/bot-server/clientes-whatsapp-server/clientes-whatsapp-server";

export interface FindClientHistoryQuery {
  search?: string;

  direction?: WazDirection;
  status?: WazStatus;
  type?: WazMessageType;

  startDate?: string;
  endDate?: string;

  clienteId?: number;

  page?: number;
  limit?: number;
}
