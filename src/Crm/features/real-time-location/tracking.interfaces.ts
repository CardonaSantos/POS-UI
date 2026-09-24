export type EstadoTrackingTecnico = "ACTIVA" | "FINALIZADA" | "EXPIRADA";

export interface TecnicoTrackingTecnicoResumen {
  id: number;
  nombre: string;
  correo: string | null;
  telefono: string | null;
  rol: string;
  avatarUrl: string | null;
  activo: boolean;
}

export interface TecnicoTrackingHistorialFiltersDto {
  page?: number;
  limit?: number;
  search?: string;
  tecnicoId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  estadoSesion?: EstadoTrackingTecnico;
}

export interface TecnicoTrackingHistorialListItem {
  asistenciaId: number;
  fecha: string;
  horaEntrada: string;
  horaSalida: string | null;
  tecnico: TecnicoTrackingTecnicoResumen;
  asistencia: {
    minutosTarde: number | null;
    trabajoCompleto: boolean;
  };
  tracking: {
    sesionesTotal: number;
    sesionesFinalizadas: number;
    sesionesExpiradas: number;
    haySesionActiva: boolean;
    primeraActivacion: string | null;
    ultimaFinalizacion: string | null;
    ultimoHeartbeatEn: string | null;
    minutosTracking: number;
  };
}

export interface TecnicoTrackingHistorialPaginatedResult {
  items: TecnicoTrackingHistorialListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TecnicoTrackingRealtimeView {
  tecnico: {
    id: number;
    nombre: string;
    telefono: string | null;
    rol: string;
    avatarUrl: string | null;
  };

  tracking: {
    sesionId: number;
    asistenciaId: number;

    estado: EstadoTrackingTecnico;

    iniciadoEn: string;
    ultimoHeartbeatEn: string;

    minutosSesionActual: number;
  };

  jornada: {
    fecha: string;

    horaEntrada: string;
    horaSalida: string | null;

    sesionesTotal: number;
    sesionesFinalizadas: number;
    sesionesExpiradas: number;

    minutosTracking: number;

    minutosJornadaConfirmados: number;

    minutosSinTrackingConfirmados: number;
  };

  ubicacion: {
    latitud: number;
    longitud: number;

    precision: number | null;
    velocidad: number | null;

    bateria: number | null;

    capturadoEn: string | null;
    recibidoEn: string;
  } | null;

  actividad: {
    ticketsEnProceso: Array<{
      id: number;
      titulo: string | null;
      estado: string;
      prioridad: string;
    }>;
  };
}

export interface TecnicoTrackingSesionDetalle {
  id: number;
  estado: EstadoTrackingTecnico;
  iniciadoEn: string;
  finalizadoEn: string | null;
  ultimoHeartbeatEn: string;
  duracionMinutos: number;
  puntosRegistrados: number;
  bateriaInicial: number | null;
  bateriaFinal: number | null;
  primeraUbicacion: {
    latitud: number;
    longitud: number;
    capturadoEn: string | null;
  } | null;
  ultimaUbicacion: {
    latitud: number;
    longitud: number;
    capturadoEn: string | null;
  } | null;
}

export interface TecnicoTrackingAsistenciaDetalle {
  asistencia: {
    id: number;
    fecha: string;
    horaEntrada: string;
    horaSalida: string | null;
    minutosTarde: number | null;
    trabajoCompleto: boolean;
  };
  tecnico: TecnicoTrackingTecnicoResumen;
  resumen: {
    sesionesTotal: number;
    sesionesFinalizadas: number;
    sesionesExpiradas: number;
    haySesionActiva: boolean;
    primeraActivacion: string | null;
    ultimaFinalizacion: string | null;
    ultimoHeartbeatEn: string | null;
    minutosTracking: number;
    minutosJornada: number | null;
    minutosSinTracking: number | null;
  };
  sesiones: TecnicoTrackingSesionDetalle[];
}

export interface TecnicoTrackingUbicacionesFiltersDto {
  sesionTrackingId?: number;
  page?: number;
  limit?: number;
}

export interface TecnicoTrackingUbicacionListItem {
  id: number;
  sesionTrackingId: number | null;
  latitud: number;
  longitud: number;
  precision: number | null;
  velocidad: number | null;
  bateria: number | null;
  capturadoEn: string | null;
  recibidoEn: string;
}

export interface TecnicoTrackingUbicacionesPaginatedResult {
  items: TecnicoTrackingUbicacionListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TecnicoTrackingStateChangedPayload {
  tecnicoId: number;
  sesionTrackingId: number;
  asistenciaId: number;
  estado: EstadoTrackingTecnico;
  iniciadoEn: string;
  finalizadoEn: string | null;
  ultimoHeartbeatEn: string;
}
