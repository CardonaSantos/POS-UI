import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { useSocketEvent } from "@/Crm/WEB/SocketProvider";

import type {
  TecnicoTrackingAsistenciaDetalle,
  TecnicoTrackingHistorialFiltersDto,
  TecnicoTrackingHistorialPaginatedResult,
  TecnicoTrackingRealtimeView,
  TecnicoTrackingStateChangedPayload,
  TecnicoTrackingUbicacionesFiltersDto,
  TecnicoTrackingUbicacionesPaginatedResult,
} from "@/Crm/features/real-time-location/tracking.interfaces";

import { trackingQkeys } from "./tracking-qk";

export function useGetTrackingRealtime() {
  return crm.useQueryApi<TecnicoTrackingRealtimeView[]>(
    trackingQkeys.realtime,
    crm_endpoints.real_time_location.get_tracking_realtime,
    undefined,
    {
      staleTime: 15_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  );
}

export function useGetTrackingHistory(
  params: TecnicoTrackingHistorialFiltersDto,
) {
  return crm.useQueryApi<TecnicoTrackingHistorialPaginatedResult>(
    trackingQkeys.history(params),
    crm_endpoints.real_time_location.get_tracking_history,
    {
      params,
    },
    {
      placeholderData: (previousData) => previousData,
      staleTime: 15_000,
      refetchOnWindowFocus: false,
    },
  );
}

export function useGetTrackingAttendanceDetail(
  asistenciaId: number,
  enabled = true,
) {
  const canQuery =
    enabled && Number.isInteger(asistenciaId) && asistenciaId > 0;

  return crm.useQueryApi<TecnicoTrackingAsistenciaDetalle>(
    trackingQkeys.attendanceDetail(asistenciaId),
    crm_endpoints.real_time_location.get_tracking_attendance(asistenciaId),
    undefined,
    {
      enabled: canQuery,
      staleTime: 15_000,
    },
  );
}

export function useGetTrackingAttendanceLocations(
  asistenciaId: number,
  params: TecnicoTrackingUbicacionesFiltersDto,
  enabled = true,
) {
  const canQuery =
    enabled && Number.isInteger(asistenciaId) && asistenciaId > 0;

  return crm.useQueryApi<TecnicoTrackingUbicacionesPaginatedResult>(
    trackingQkeys.attendanceLocations(asistenciaId, params),
    crm_endpoints.real_time_location.get_tracking_locations(asistenciaId),
    {
      params,
    },
    {
      enabled: canQuery,
      placeholderData: (previousData) => previousData,
      staleTime: 15_000,
    },
  );
}

/**
 * Sincroniza las lecturas administrativas con los eventos que ya emite
 * el backend de real-time-location.
 *
 * - location-updated: actualiza el snapshot realtime sin refetch completo.
 * - state-changed: invalida realtime/history y la asistencia afectada.
 */
export function useTrackingRealtimeQuerySync() {
  const queryClient = useQueryClient();

  const handleLocationUpdated = useCallback(
    (payload: TecnicoTrackingRealtimeView) => {
      queryClient.setQueryData<TecnicoTrackingRealtimeView[]>(
        trackingQkeys.realtime,
        (current) => {
          if (!current) return [payload];

          const index = current.findIndex(
            (item) => item.tecnico.id === payload.tecnico.id,
          );

          if (index < 0) {
            return [payload, ...current];
          }

          return current.map((item) =>
            item.tecnico.id === payload.tecnico.id ? payload : item,
          );
        },
      );

      void queryClient.invalidateQueries({
        queryKey: trackingQkeys.attendance(payload.tracking.asistenciaId),
      });
    },
    [queryClient],
  );

  const handleStateChanged = useCallback(
    (payload: TecnicoTrackingStateChangedPayload) => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: trackingQkeys.realtime,
        }),
        queryClient.invalidateQueries({
          queryKey: trackingQkeys.historyRoot,
        }),
        queryClient.invalidateQueries({
          queryKey: trackingQkeys.attendance(payload.asistenciaId),
        }),
      ]);
    },
    [queryClient],
  );

  useSocketEvent("tracking:location-updated", handleLocationUpdated, [
    handleLocationUpdated,
  ]);

  useSocketEvent("tracking:state-changed", handleStateChanged, [
    handleStateChanged,
  ]);
}
