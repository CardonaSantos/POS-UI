// types/enums.ts

import { PaginatedMeta } from "../whatsapp-messages/query";

export enum WazDirection {
  INBOUND = "INBOUND", // Entrante (Cliente -> Bot)
  OUTBOUND = "OUTBOUND", // Saliente (Bot -> Cliente)
}

export enum WazStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ",
  FAILED = "FAILED",
}
export enum WazMessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  DOCUMENT = "DOCUMENT",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  STICKER = "STICKER",
  LOCATION = "LOCATION",
  CONTACTS = "CONTACTS",
  INTERACTIVE = "INTERACTIVE",
  BUTTON = "BUTTON",
  UNKNOWN = "UNKNOWN",
}

// types/models.ts

export interface Cliente {
  id: number;
  empresaId: number;
  nombre: string;
  telefono: string;
  uuid: string | null;
  creadoEn: string; // ISO Date String
  botActivo: boolean;
}

export interface WhatsappMessage {
  id: number;
  wamid: string;
  chatSessionId: number;
  clienteId: number;

  // Enums para control estricto
  direction: WazDirection;
  status: WazStatus;
  type: WazMessageType;

  from: string;
  to: string;
  body: string; // Puede venir el texto o el caption de la imagen

  // Campos Multimedia (Nullables)
  mediaUrl: string | null;
  mediaMimeType: string | null;
  mediaSha256: string | null;

  // Manejo de Errores y Respuestas
  errorCode: string | null;
  errorMessage: string | null;
  replyToWamid: string | null; // ID del mensaje al que se responde

  // Fechas
  timestamp: string; // Nota: WhatsApp lo manda como string numérico en tu JSON
  creadoEn: string; // ISO Date String
  actualizadoEn: string; // ISO Date String
}
export interface ClientHistoryResponse {
  data: {
    cliente: Cliente;
    chats: WhatsappMessage[];
  };
  meta: PaginatedMeta;
}
