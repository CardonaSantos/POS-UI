export interface Ubicacion {
  lat: number;
  lng: number;
}

export interface PersonaCampo {
  id: number;
  nombreCompleto: string;
  location: Ubicacion;
}

export interface RutaActiva {
  nombreRuta: string;
  cobrador: string;
  totalClientes: number;
}

export interface MorosoTop {
  id: number;
  nombre: string;
  cantidad: number; // ej: meses de atraso o facturas
}

export type TicketStatus = "pending" | "done";

export interface TicketSoporteDashboard {
  id: number;
  titulo: string;
  cliente: string;
  tecnico?: string;
  status: TicketStatus;
  acompanantes?: Array<String>;
}

export interface TicketsMetricasDashboard {
  enLinea: number;
}

export interface TicketsDashboardSoporte {
  tickets: TicketSoporteDashboard[];
  ticketsMetricas: TicketsMetricasDashboard;
}
