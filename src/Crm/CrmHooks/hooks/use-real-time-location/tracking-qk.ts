import type {
  TecnicoTrackingHistorialFiltersDto,
  TecnicoTrackingUbicacionesFiltersDto,
} from "@/Crm/features/real-time-location/tracking.interfaces";

export const trackingQkeys = {
  all: ["real-time-location", "tracking"] as const,

  realtime: ["real-time-location", "tracking", "realtime"] as const,

  historyRoot: ["real-time-location", "tracking", "history"] as const,

  history: (params: TecnicoTrackingHistorialFiltersDto) =>
    [...trackingQkeys.historyRoot, params] as const,

  attendanceRoot: ["real-time-location", "tracking", "attendance"] as const,

  attendance: (asistenciaId: number) =>
    [...trackingQkeys.attendanceRoot, asistenciaId] as const,

  attendanceDetail: (asistenciaId: number) =>
    [...trackingQkeys.attendance(asistenciaId), "detail"] as const,

  attendanceLocations: (
    asistenciaId: number,
    params: TecnicoTrackingUbicacionesFiltersDto,
  ) => [...trackingQkeys.attendance(asistenciaId), "locations", params] as const,
};
