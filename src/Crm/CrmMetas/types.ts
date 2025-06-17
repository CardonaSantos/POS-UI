// Interface para el front-end que representa la respuesta de metas de técnico

// Enum de estados según el modelo Prisma
export type EstadoMetaTicket =
  | "CANCELADO"
  | "ABIERTO"
  | "FINALIZADO"
  | "CERRADO";

// Rol de usuario (puede ampliarse según tu sistema de autenticación)
export type UserRole = "ADMIN" | "TECNICO" | "USER";

// Estructura del objeto técnico anidado
export interface Tecnico {
  id: number;
  nombre: string;
  rol: UserRole;
  correo: string;
}

// Interfaz principal para la meta del técnico
export interface MetaTecnicoTicket {
  id: number;
  cumplida: boolean;
  estado: EstadoMetaTicket;
  fechaCumplida: string | null; // ISO Date string o null
  fechaFin: string; // ISO Date string
  fechaInicio: string; // ISO Date string
  metaTickets: number;
  ticketsResueltos: number;
  titulo?: string;
  tecnico: Tecnico;
}

// Ejemplo de uso: respuesta del endpoint GET /meta-tecnico-ticket
// Payload para crear una nueva meta (POST /meta-tecnico-ticket)
export interface CreateMetaTecnicoTicketPayload {
  tecnicoId: number;
  fechaInicio: string; // ISO Date string, ej. "2025-07-01T00:00:00.000Z"
  fechaFin: string; // ISO Date string, ej. "2025-07-31T23:59:59.999Z"
  metaTickets: number;
  titulo?: string; // Opcional: nombre descriptivo de la meta
}
