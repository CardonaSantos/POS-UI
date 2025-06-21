import { RolUsuario } from "../CrmProfile/interfacesProfile";

export interface User {
  id: number;
  name: string;
  initials: string;
  avatar?: string;
}

export interface Companion {
  id: number;
  name: string;
  rol: RolUsuario;
}

export interface Comment {
  user: User;
  text: string;
  date: string;
  isPrivate?: boolean;
}

export interface Customer {
  id: number;
  name: string;
}

enum EstadoTicketSoporte {
  NUEVO = "NUEVO",
  ABIERTA = "ABIERTA",
  EN_PROCESO = "EN_PROCESO",
  PENDIENTE = "PENDIENTE",
  PENDIENTE_CLIENTE = "PENDIENTE_CLIENTE",
  PENDIENTE_TECNICO = "PENDIENTE_TECNICO",
  RESUELTA = "RESUELTA",
  CANCELADA = "CANCELADA",
  ARCHIVADA = "ARCHIVADA",
}

enum PrioridadTicketSoporte {
  BAJA = "BAJA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
  URGENTE = "URGENTE",
}

interface Tags {
  value: string;
  label: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: EstadoTicketSoporte;
  priority: PrioridadTicketSoporte;
  assignee: User;
  companios: Companion[];
  creator: User;
  date: string;
  unread?: boolean;
  tags?: Tags[];
  comments?: Comment[];
  customer: Customer;
}
