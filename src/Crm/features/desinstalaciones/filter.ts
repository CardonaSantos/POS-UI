import type {
  EstadoDesinstalacionCliente,
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "./desinstalaciones.enums";

export type FiltrarClienteDesinstalacionesParams = {
  /**
   * Aunque el DTO backend actualmente lo marca opcional,
   * para esta vista administrativa siempre enviamos
   * la empresa activa del CRM.
   */
  empresaId: number;

  page?: number;

  limit?: number;

  search?: string;

  accesoInternetId?: number;

  clienteId?: number;

  solicitadoPorId?: number;

  servicioInternetId?: number;

  ticketId?: number;

  ejecutadoPorId?: number;

  creadoPorId?: number;

  estado?: EstadoDesinstalacionCliente;

  tipo?: TipoDesinstalacionCliente;

  motivo?: MotivoDesinstalacionCliente;

  fechaProgramadaDesde?: string;

  fechaProgramadaHasta?: string;

  fechaFinalizacionDesde?: string;

  fechaFinalizacionHasta?: string;
};
