import type {
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "./desinstalaciones.enums";

export type RolTecnicoDesinstalacion = "RESPONSABLE" | "APOYO";

export interface CrearDesinstalacionTecnicoPayload {
  tecnicoId: number;

  rol: RolTecnicoDesinstalacion;

  esResponsable: boolean;
}

export interface CrearDesinstalacionPayload {
  clienteId: number;

  accesoInternetId: number;

  ticketId?: number;

  tipo: TipoDesinstalacionCliente;

  motivo: MotivoDesinstalacionCliente;

  fechaProgramada: string;

  requiereRetiroEquipo: boolean;

  observaciones?: string;

  tecnicos?: CrearDesinstalacionTecnicoPayload[];
}

// OTROS
export interface CrearDesinstalacionTecnicoResponse {
  id: number;

  desinstalacionId: number;

  tecnicoId: number | null;

  rol: string | null;

  esResponsable: boolean;

  tiempoMinutos: number | null;

  observaciones: string | null;

  tecnicoNombreSnapshot: string | null;

  creadoEn: string | null;

  actualizadoEn: string | null;
}

export interface CrearDesinstalacionResponse {
  id: number;

  empresaId: number;

  clienteId: number;

  servicioInternetId: number | null;

  ticketId: number | null;

  accesoInternetId: number | null;

  solicitadoPorId: number | null;

  ejecutadoPorId: number | null;

  creadoPorId: number | null;

  tipo: TipoDesinstalacionCliente;

  motivo: MotivoDesinstalacionCliente | null;

  estado: string;

  fechaSolicitud: string | null;

  fechaProgramada: string | null;

  fechaInicio: string | null;

  fechaFinalizacion: string | null;

  fechaCancelacion: string | null;

  requiereRetiroEquipo: boolean;

  equipoRecuperado: boolean;

  costos: {
    saldoClienteAlMomento: number;

    costoDesinstalacion: number;

    costoTransporte: number;

    costoManoObra: number;

    costoOtros: number;
  };

  direccionServicio: string | null;

  referenciaUbicacion: string | null;

  latitud: number | null;

  longitud: number | null;

  firmadoPor: string | null;

  dpiFirmante: string | null;

  conforme: boolean | null;

  observaciones: string | null;

  resultado: string | null;

  metadata: unknown | null;

  creadoEn: string | null;

  actualizadoEn: string | null;

  tecnicos: CrearDesinstalacionTecnicoResponse[];
}
