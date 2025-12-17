import {
  WazDirection,
  WazMessageType,
  WazStatus,
} from "../cliente-whatsapp-historial/cliente-historial-chat.interface";

export interface ClienteLite {
  id: number;
  nombre: string;
  telefono: string;
  uuid: string | null;
  creadoEn: string; // ISO
  actualizadoEn: string; // ISO
}

export interface WhatsappMessageRow {
  id: number;
  wamid: string;
  chatSessionId: number;

  direction: WazDirection;
  from: string;
  to: string;

  type: WazMessageType;
  body: string | null;

  mediaUrl: string | null;
  mediaMimeType: string | null;
  mediaSha256: string | null;

  status: WazStatus;
  errorCode: string | null;
  errorMessage: string | null;

  replyToWamid: string | null;

  timestamp: string; // viene como "1765908125" (string). Si querés: number/bigint en UI lo parseás.
  creadoEn: string; // ISO
  actualizadoEn: string; // ISO

  cliente: ClienteLite;
}

// FILTRADO
export interface ChatFilters {
  direction?: WazDirection;
  type?: WazMessageType;
  status?: WazStatus;
  clienteId?: number;
  dateFrom?: string;
  dateTo?: string;
}

// la respuesta del endpoint findMany:
export type WhatsappMessagesResponse = WhatsappMessageRow[];
