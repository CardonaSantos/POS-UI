import type {
  EstadoDesinstalacionCliente,
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "@/Crm/features/desinstalaciones/desinstalaciones.enums";

import type { FiltrarClienteDesinstalacionesParams } from "@/Crm/features/desinstalaciones/filter";

export type DesinstalacionesDateRange = {
  start: string | null;

  end: string | null;
};

export type DesinstalacionesListFiltersState = {
  estado: EstadoDesinstalacionCliente | null;

  tipo: TipoDesinstalacionCliente | null;

  motivo: MotivoDesinstalacionCliente | null;

  fechaProgramada: DesinstalacionesDateRange;

  fechaFinalizacion: DesinstalacionesDateRange;
};

export const DESINSTALACIONES_LIST_FILTERS_DEFAULT: DesinstalacionesListFiltersState =
  {
    estado: null,

    tipo: null,

    motivo: null,

    fechaProgramada: {
      start: null,
      end: null,
    },

    fechaFinalizacion: {
      start: null,
      end: null,
    },
  };

type ToDesinstalacionesQueryParams = {
  empresaId: number;

  pageIndex: number;

  pageSize: number;

  search: string;

  filters: DesinstalacionesListFiltersState;
};

export function toDesinstalacionesQueryParams({
  empresaId,
  pageIndex,
  pageSize,
  search,
  filters,
}: ToDesinstalacionesQueryParams): FiltrarClienteDesinstalacionesParams {
  const normalizedSearch = search.trim();

  return {
    empresaId,

    page: pageIndex + 1,

    limit: pageSize,

    search: normalizedSearch || undefined,

    estado: filters.estado ?? undefined,

    tipo: filters.tipo ?? undefined,

    motivo: filters.motivo ?? undefined,

    fechaProgramadaDesde: filters.fechaProgramada.start ?? undefined,

    fechaProgramadaHasta: filters.fechaProgramada.end ?? undefined,

    fechaFinalizacionDesde: filters.fechaFinalizacion.start ?? undefined,

    fechaFinalizacionHasta: filters.fechaFinalizacion.end ?? undefined,
  };
}
