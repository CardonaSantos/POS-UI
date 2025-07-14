// Interface para el front-end que representa la respuesta de metas de técnico

import { RolUsuario } from "../CrmProfile/interfacesProfile";

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
  estado?: string;
}

export interface Tecnicos {
  id: number;
  nombre: string;
  rol: RolUsuario;
}

export interface OptionSelected {
  value: string;
  label: string;
}

//Para metricas
export interface Metrics {
  tecnicoId: number;
  nombre: string;
  correo: string;
  totalTickets: number;
  ticketsResueltos: number;
  ticketsPendientes: number;
  tasaResolucion: number; // %
  tiempoPromedioHrs: number; // horas
  ticketsPorDia: number;
  proyeccion: number;
  diasTranscurridos: number;
  totalDias: number;
}

export interface MetricChartsProps {
  loading?: boolean;
}
export interface TicketResueltoDiaRaw {
  dia: number; // 1-31
  tecnicoId: number;
  tecnicoNombre: string; // ej. "Santos Miguel"
  resueltos: number; // tickets resueltos ese día
}
//otras metricas del día
export interface Tecnico {
  id: number;
  nombre: string;
}

export enum PrioridadTicketSoporte {
  BAJA = "BAJA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
  URGENTE = "URGENTE",
}

export enum EstadoTicket {
  NUEVO = "NUEVO",
  ABIERTA = "ABIERTA",
  EN_PROCESO = "EN_PROCESO",
  PENDIENTE = "PENDIENTE",
  PENDIENTE_CLIENTE = "PENDIENTE_CLIENTE",
  PENDIENTE_TECNICO = "PENDIENTE_TECNICO",
  RESUELTA = "RESUELTA",
  CANCELADA = "",
  ARCHIVADA = "ARCHIVADA",
  CERRADO = "CERRADO",
}
interface Acompañantes {
  id: number;
  nombre: string;
}
export interface TicketMoment {
  id: number;
  titulo: string;
  descripcion: string;
  estado: EstadoTicket;
  prioridad: PrioridadTicketSoporte;
  tecnico: Tecnico;
  acompanantes: Acompañantes[];
  cliente: {
    id: number;
    nombre: string;
    apellidos: string;
  };
}

export interface TicketsEnProceso {
  ticket: TicketMoment[];
}

export interface TicketsActuales {
  tickets: number;
  ticketsResueltos: number;
  ticketsEnProceso: number;
  ticketsAsignados: number;
  resueltosDelMes: number;
}

export enum EstadoMetaTicketEnum {
  CANCELADO = "CANCELADO",
  ABIERTO = "ABIERTO",
  FINALIZADO = "FINALIZADO",
  CERRADO = "CERRADO",
}
