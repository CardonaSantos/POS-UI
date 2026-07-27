import { EstadoInstalacionCliente, TipoInstalacionCliente } from "./enums";

export type FiltrarClienteInstalacionesParams = {
  empresaId: number;

  page?: number;
  limit?: number;

  search?: string;

  clienteId?: number;
  servicioInternetId?: number;
  ticketId?: number;
  asesorId?: number;
  creadoPorId?: number;
  completadoPorId?: number;

  estado?: EstadoInstalacionCliente;
  tipo?: TipoInstalacionCliente;

  fechaProgramadaDesde?: string;
  fechaProgramadaHasta?: string;

  fechaFinalizacionDesde?: string;
  fechaFinalizacionHasta?: string;
};
