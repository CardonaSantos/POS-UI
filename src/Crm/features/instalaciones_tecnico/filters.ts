import { EstadoInstalacionCliente } from "../instalaciones/enums";

export interface ListarInstalacionesTecnicasAsignadasParams {
  page?: number;
  limit?: number;
  search?: string;
  estado?: EstadoInstalacionCliente;
  fechaProgramadaDesde?: string;
  fechaProgramadaHasta?: string;
}

export interface FiltrarMisInstalacionesAsignadasParams {
  page?: number;

  limit?: number;

  search?: string;

  estado?: EstadoInstalacionCliente;

  fechaProgramadaDesde?: string;

  fechaProgramadaHasta?: string;
}
