import type {
  EstadoTrackingTecnico,
  TecnicoTrackingHistorialFiltersDto,
} from "./tracking.interfaces";

export interface TrackingHistoryFiltersState {
  tecnicoId: number | null;
  estadoSesion: EstadoTrackingTecnico | null;
  fecha: {
    start: string | null;
    end: string | null;
  };
}

export const TRACKING_HISTORY_FILTERS_DEFAULT: TrackingHistoryFiltersState = {
  tecnicoId: null,
  estadoSesion: null,
  fecha: {
    start: null,
    end: null,
  },
};

export function toTrackingHistoryQueryParams(params: {
  pageIndex: number;
  pageSize: number;
  search: string;
  filters: TrackingHistoryFiltersState;
}): TecnicoTrackingHistorialFiltersDto {
  const search = params.search.trim().slice(0, 150);

  return {
    page: params.pageIndex + 1,
    limit: params.pageSize,
    ...(search ? { search } : {}),
    ...(params.filters.tecnicoId
      ? { tecnicoId: params.filters.tecnicoId }
      : {}),
    ...(params.filters.estadoSesion
      ? { estadoSesion: params.filters.estadoSesion }
      : {}),
    ...(params.filters.fecha.start
      ? { fechaDesde: params.filters.fecha.start }
      : {}),
    ...(params.filters.fecha.end
      ? { fechaHasta: params.filters.fecha.end }
      : {}),
  };
}
