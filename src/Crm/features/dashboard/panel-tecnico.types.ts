import type { RolUsuario } from "@/Crm/features/users/users-rol";

export interface TecnicoPanelUsuario {
  id: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  activo: boolean;
}

export interface TecnicoPanelPeriodo {
  inicioMes: string;
  finMes: string;
  diasTranscurridos: number;
  zonaHoraria: string;
}

export interface TecnicoPanelCargaActual {
  ticketsPendientes: number;
  ticketsListosParaTrabajar: number;
  ticketsUrgentes: number;
  ticketsConMas48Horas: number;

  instalacionesPendientes: number;
  instalacionesProgramadasHoy: number;
  instalacionesAtrasadas: number;
}

export interface TecnicoPanelProductividadMes {
  ticketsResueltos: number;
  instalacionesCompletadas: number;
  trabajosCompletados: number;

  diasConActividad: number;

  promedioTicketsPorDia: number;
  ritmoSemanalTickets: number;
  promedioTrabajosPorDiaActivo: number;
}

export interface TecnicoPanelTiempos {
  promedioResolucionTicketMinutos: number | null;
  promedioInstalacionMinutos: number | null;
}

export interface TecnicoPanelActividadDia {
  fecha: string;
  etiqueta: string;

  tickets: number;
  instalaciones: number;
  total: number;
}

export interface TecnicoPanelResumenActividad {
  /**
   * Recomiendo permitir null para que la UI soporte
   * correctamente técnicos que todavía no hayan realizado
   * ningún trabajo durante el mes.
   */
  diaMasProductivo: TecnicoPanelActividadDia | null;

  diaMenosProductivoConActividad: TecnicoPanelActividadDia | null;
}

export interface TecnicoPanelResponse {
  tecnico: TecnicoPanelUsuario;

  periodo: TecnicoPanelPeriodo;

  cargaActual: TecnicoPanelCargaActual;

  productividadMes: TecnicoPanelProductividadMes;

  tiempos: TecnicoPanelTiempos;

  resumenActividad: TecnicoPanelResumenActividad;

  actividadDiaria: TecnicoPanelActividadDia[];
}

// opcionales para cards
export type TecnicoMetricTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface TecnicoMetricItem {
  id: string;
  label: string;
  value: number | string;
  description?: string;
  tone?: TecnicoMetricTone;
}
