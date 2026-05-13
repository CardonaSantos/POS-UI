export interface ClientesPaginatedResponse {
  data: Array<ClienteWhatsappServerListItem>;
  meta: PaginationMeta;
}

export enum WazMediaType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO", // Notas de voz
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT", // PDFs
  STICKER = "STICKER",
  LOCATION = "LOCATION",
  TEMPLATE = "TEMPLATE", // Plantillas de marketing
  INTERACTIVE = "INTERACTIVE", // Botones y listas
  UNKNOWN = "UNKNOWN",
}

export enum WazStatus {
  SENT = "SENT", // Un check gris (Enviado a Meta)
  DELIVERED = "DELIVERED", // Doble check gris (Llegó al celular)
  READ = "READ", // Doble check azul (Leído)
  FAILED = "FAILED", // Error (No salió)
}

export enum WazDirection {
  INBOUND = "INBOUND", // Cliente -> Bot
  OUTBOUND = "OUTBOUND", // Bot -> Cliente
}

export enum ChatChannel {
  WHATSAPP = "WHATSAPP",
  WEB = "WEB",
  TELEGRAM = "TELEGRAM",
  SMS = "SMS",
  OTHER = "OTHER",
}

export interface ClienteWhatsappServerListItem {
  id: number;

  empresaId: number;

  contacto: {
    nombre: string | null;
    telefono: string;

    avatarUrl: string | null;
    iniciales: string;

    crmUsuarioId: number | null;
    uuid: string | null;

    botActivo: boolean;
  };

  chat: {
    unreadCount: number;

    archived: boolean;
    pinned: boolean;
    muted: boolean;

    status: WazStatus;

    canal: ChatChannel;

    lastActivityAt: string;
    createdAt: string;
  };

  ultimoMensaje: {
    id: number;

    contenido: string | null;

    tipo: WazMediaType;

    direccion: "INBOUND" | "OUTBOUND";

    estado: "SENT" | "DELIVERED" | "READ" | "FAILED";

    enviadoPorBot: boolean;

    mediaUrl: string | null;

    timestamp: number;

    creadoEn: string;
  };

  crm: {
    clienteRegistrado: boolean;

    ticketAbierto: boolean;

    ultimoTicketCrmId: string | null;
  };
}

// export interface ClienteWhatsappServerListItem {
//   id: number;
//   empresaId: number;
//   nombre: string | null;
//   telefono: string;
//   uuid: string | null;
//   creadoEn: string; // ISO date string
//   mensajesSinVer: number;
//   botActivo: boolean;
// }

export interface PaginationMeta {
  total: number;
  take: number;
  skip: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
