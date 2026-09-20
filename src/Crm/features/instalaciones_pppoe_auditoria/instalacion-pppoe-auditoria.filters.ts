import type {
  AccionAuditoriaPppoe,
  EstadoOperacionPppoe,
  OrigenOperacionPppoe,
  TipoOperacionPppoe,
} from "./instalacion-pppoe-auditoria.interfaces";

export type InstalacionPppoeAuditoriaFilters = {
  page: number;
  limit: number;
  search: string;
  serverSearch: string;
  tipoOperacion: TipoOperacionPppoe | null;
  estadoOperacion: EstadoOperacionPppoe | null;
  accion: AccionAuditoriaPppoe | null;
  origen: OrigenOperacionPppoe | null;
  fecha: {
    start: string | null;
    end: string | null;
  };
  ordenDireccion: "asc" | "desc";
};

export type FiltrarAuditoriaPppoeInstalacionParams = {
  page: number;
  limit: number;
  search?: string;
  tipoOperacion?: TipoOperacionPppoe;
  estadoOperacion?: EstadoOperacionPppoe;
  accion?: AccionAuditoriaPppoe;
  origen?: OrigenOperacionPppoe;
  fechaDesde?: string;
  fechaHasta?: string;
  ordenDireccion?: "asc" | "desc";
};

export const INSTALACION_PPPOE_AUDITORIA_FILTER_DEFAULTS:
  InstalacionPppoeAuditoriaFilters = {
    page: 1,
    limit: 10,
    search: "",
    serverSearch: "",
    tipoOperacion: null,
    estadoOperacion: null,
    accion: null,
    origen: null,
    fecha: {
      start: null,
      end: null,
    },
    ordenDireccion: "desc",
  };
