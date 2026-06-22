import { Ticket } from "../ticketTypes";
import { Sector } from "@/Crm/features/cliente-interfaces/cliente-types";
import { QuerySearchTickets } from "@/Crm/CrmHooks/hooks/use-tickets/useTicketsSoporte";
import { EstadoTicketSoporte } from "@/Crm/features/dashboard/dashboard-tickets";

export interface Tecnico {
  id: number;
  nombre: string;
}

export interface Etiqueta {
  id: number;
  nombre: string;
}

export type DateSide = "start" | "end";

export type TicketQuickView = "all" | "assignedToMe" | "createdByMe";

export interface Tecnico {
  id: number;
  nombre: string;
}

export interface Etiqueta {
  id: number;
  nombre: string;
}

export interface TicketFiltersProps {
  ticketsTotal: number;
  tickets?: Ticket[];

  value: QuerySearchTickets;
  onChange: (patch: Partial<QuerySearchTickets>) => void;

  userId: number;

  tecnicos: Tecnico[];
  etiquetas: Etiqueta[];
  sectores: Sector[];

  openCreatT: boolean;
  setOpenCreateT: (open: boolean) => void;
  getTickets: () => void;
}

export type TicketStatusFilter = EstadoTicketSoporte | null;
