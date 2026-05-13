import { EstadoTicketSoporte } from "../features/dashboard/dashboard-tickets";
import { RolUsuario } from "../features/users/users-rol";

export interface User {
  id: number;
  name: string;
  initials: string;
  avatar?: string;
  rol: RolUsuario;
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
  description: string | null;
  fixed: boolean;
  status: EstadoTicketSoporte;
  priority: PrioridadTicketSoporte;
  assignee: User | null;
  companios: Companion[];
  creator: User | null;
  date: string;
  closedAt: string;
  unread?: boolean;
  tags?: Tags[];
  comments?: Comment[];
  customer: Customer | null;
  metrics: MetricsTicket;
}

export interface MetricsTicket {
  timeSpentMinutes: number; // Tiempo total (Vivo o Cerrado)
  logsCount: number; // Cuantas veces se trabajó
  resolution: Solucion;
}
interface Solucion {
  solutionName: string;
  solutionDesc: string;
  resolutionNote: string;
  internalNote: string;
}
