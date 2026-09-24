import * as React from "react";

import {
  useGetTrackingAttendanceDetail,
  useGetTrackingAttendanceLocations,
} from "@/Crm/CrmHooks/hooks/use-real-time-location/use-tracking";

const ROUTE_POINTS_LIMIT = 1000;

export function useTrackingAttendanceDetailPage(asistenciaId: number) {
  const enabled = Number.isInteger(asistenciaId) && asistenciaId > 0;

  const detailQuery = useGetTrackingAttendanceDetail(
    asistenciaId,
    enabled,
  );

  const locationsQuery = useGetTrackingAttendanceLocations(
    asistenciaId,
    {
      page: 1,
      limit: ROUTE_POINTS_LIMIT,
    },
    enabled && Boolean(detailQuery.data),
  );

  const locations = locationsQuery.data?.items ?? [];
  const totalLocationPoints = locationsQuery.data?.total ?? 0;

  const refetchAll = React.useCallback(async () => {
    await Promise.allSettled([
      detailQuery.refetch(),
      locationsQuery.refetch(),
    ]);
  }, [detailQuery, locationsQuery]);

  return {
    detail: detailQuery.data,
    locations,
    totalLocationPoints,
    loadedLocationPoints: locations.length,
    routePointsLimit: ROUTE_POINTS_LIMIT,
    routeIsPartial: (locationsQuery.data?.totalPages ?? 0) > 1,

    isLoading:
      detailQuery.isLoading ||
      (Boolean(detailQuery.data) && locationsQuery.isLoading),

    isFetching: detailQuery.isFetching || locationsQuery.isFetching,
    error: detailQuery.error ?? locationsQuery.error ?? null,

    refetchAll,
  };
}
