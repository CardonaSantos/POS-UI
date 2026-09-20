export interface ReprogramarInstalacionTecnicaPayload {
  fechaProgramada: string;
  motivo?: string | null;
}

export interface IniciarInstalacionTecnicaPayload {
  // contrasenaActual: string;
  fechaInicio?: string;
  // activarServicio?: boolean;
}

export interface CompletarInstalacionTecnicaPayload {
  resultado?: string | null;
  observaciones?: string | null;
  fechaFinalizacion?: string;
  activarServicio?: boolean;
}

export interface CancelarInstalacionTecnicaPayload {
  motivo?: string;
  observaciones?: string | null;
  fechaCancelacion?: string;
}

export interface ReintentarPrealtaPppoePayload {
  mikrotikRouterId: number;
}
