export type EstadoTicketSoporte =
  | "ABIERTA"
  | "EN_PROCESO"
  | "PENDIENTE"
  | "PENDIENTE_CLIENTE"
  | "PENDIENTE_TECNICO"
  | "NUEVO"
  | "PENDIENTE_REVISION";

export type PrioridadTicketSoporte = "BAJA" | "MEDIA" | "ALTA" | "URGENTE"; // ajusta a tu enum real

export interface UbicacionMaps {
  lat: number;
  lng: number;
}

export interface TicketMedia {
  id: number;
  titulo: string | null; // en DB es String? así que puede venir null
  descripcion: string | null;
  notas: string | null;
  creadoEn: string; // ISO string (puedes parsear con dayjs)
  actualizadoEn: string;
  cdnUrl: string;
}

export interface TicketAsignadoTecnico {
  id: number;
  titulo: string | null;
  abiertoEn: string; // ISO date
  estado: EstadoTicketSoporte;
  prioridad: PrioridadTicketSoporte;
  descripcion: string | null;

  clientId: number;
  clienteNombre: string;
  clienteTel: string | null;
  referenciaContacto: string | null;

  direccion: Direccion;
  observaciones: string;

  ubicacionMaps: UbicacionMaps | null;
  medias: TicketMedia[]; // siempre array (vacío si no hay nada)
}

interface Direccion {
  direccion: string;
  sector: string;
  municipio: string;
}

// Conveniente para la respuesta completa:
export type TicketsAsignadosResponse = TicketAsignadoTecnico[];
