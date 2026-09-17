export type DashboardTicketsActividadPreset =
  | "7D"
  | "30D"
  | "12M"
  | "HISTORICO"
  | "CUSTOM";

export type DashboardTicketsGranularidad = "DIA" | "MES" | "TRIMESTRE" | "ANIO";

export type DashboardTicketPrioridad = "BAJA" | "MEDIA" | "ALTA" | "URGENTE";

export interface DashboardTicketsActividadParams {
  preset: DashboardTicketsActividadPreset;

  /**
   * Solo aplican cuando preset === "CUSTOM".
   * Formato YYYY-MM-DD.
   */
  desde?: string;
  hasta?: string;
}

export interface DashboardTicketsPrioridades {
  BAJA: number;
  MEDIA: number;
  ALTA: number;
  URGENTE: number;
}

export interface DashboardTicketsActividadPoint {
  periodo: string;

  creados: number;
  resueltos: number;

  prioridades: {
    creados: DashboardTicketsPrioridades;
    resueltos: DashboardTicketsPrioridades;
  };
}

export interface DashboardTicketsActividad {
  periodo: {
    preset: DashboardTicketsActividadPreset;

    desde: string;
    hasta: string;

    granularidad: DashboardTicketsGranularidad;

    puntos: number;

    zonaHoraria: string;
  };

  resumen: {
    creados: number;
    resueltos: number;

    pendientesActuales: number;

    urgentesPendientes: number;
    altosPendientes: number;

    pendientesMas48Horas: number;
  };

  tiempos: {
    promedioResolucionMinutos: number | null;
    promedioPrimeraAtencionMinutos: number | null;
  };

  prioridades: {
    creadosPeriodo: DashboardTicketsPrioridades;
    resueltosPeriodo: DashboardTicketsPrioridades;
    pendientesActuales: DashboardTicketsPrioridades;
  };

  comparativa: {
    periodoAnterior: {
      desde: string;
      hasta: string;
    };

    creados: {
      actual: number;
      anterior: number;
      variacionPorcentaje: number | null;
    };

    resueltos: {
      actual: number;
      anterior: number;
      variacionPorcentaje: number | null;
    };
  } | null;

  actividad: DashboardTicketsActividadPoint[];
}
