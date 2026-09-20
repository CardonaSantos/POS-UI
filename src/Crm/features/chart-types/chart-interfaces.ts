export interface DashboardActividadMes {
  periodo: {
    desde: string;
    hasta: string;
    zonaHoraria: string;
  };

  totales: {
    instalaciones: number;
    desinstalaciones: number;
  };

  actividadDiaria: {
    fecha: string;
    instalaciones: number;
    desinstalaciones: number;
  }[];
}

export interface DashboardActividadHistorica {
  periodo: {
    desde: string;
    hasta: string;
    meses: number;
    zonaHoraria: string;
  };

  totales: {
    instalaciones: number;
    desinstalaciones: number;
    promedioInstalacionesMes: number;
    promedioDesinstalacionesMes: number;
  };

  actividadMensual: {
    mes: string;
    instalaciones: number;
    desinstalaciones: number;
  }[];
}
