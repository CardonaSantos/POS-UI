export interface SolicitarAutorizacionDesinstalacionPayload {
  motivoSolicitud?: string;
}

export interface SolicitarAutorizacionDesinstalacionResponse {
  id: number;

  desinstalacionId: number;

  solicitadoPorId: number | null;

  autorizadoPorId: number | null;

  estado: string;

  motivoSolicitud: string | null;

  comentarioAutorizador: string | null;

  fechaSolicitud: string;

  fechaRespuesta: string | null;
}
