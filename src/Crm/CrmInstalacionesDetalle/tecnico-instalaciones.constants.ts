import { EstadoInstalacionCliente } from "@/Crm/features/instalaciones/enums";
import type { InstalacionTecnicaAsignada } from "@/Crm/features/instalaciones_tecnico/instalaciones-tecnicas-response.interface";

export const PAGE_SIZE = 8;
export const EMPTY_INSTALLATIONS: InstalacionTecnicaAsignada[] = [];

export type FiltrosInstalacionesState = {
  page: number;
  search: string;
  serverSearch: string;
  estado: EstadoInstalacionCliente | undefined;
};

export type EstadoFiltro = {
  value: EstadoInstalacionCliente | undefined;
  label: string;
};

export const ESTADOS_FILTRO: readonly EstadoFiltro[] = [
  { value: undefined, label: "Todas" },
  { value: EstadoInstalacionCliente.PROGRAMADA, label: "Programadas" },
  { value: EstadoInstalacionCliente.EN_PROCESO, label: "En proceso" },
  { value: EstadoInstalacionCliente.COMPLETADA, label: "Completadas" },
];
