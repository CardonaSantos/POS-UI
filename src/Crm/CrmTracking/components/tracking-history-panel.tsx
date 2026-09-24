import * as React from "react";

import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";
import { AppStack } from "@/components/app/primitives/app-stack";

import { useGetReporteTicketTecnicos } from "@/Crm/CrmHooks/hooks/reports/reportes-catalogos-hook";
import { useGetTrackingHistory } from "@/Crm/CrmHooks/hooks/use-real-time-location/use-tracking";
import {
  TRACKING_HISTORY_FILTERS_DEFAULT,
  toTrackingHistoryQueryParams,
  type TrackingHistoryFiltersState,
} from "@/Crm/features/real-time-location/tracking.filters";

import { TrackingHistoryFilters } from "./tracking-history-filters";
import { TrackingHistoryTable } from "./tracking-history-table";
import { createTrackingHistoryColumns } from "./tracking-history-table.columns";

const EMPTY_ITEMS: never[] = [];

export function TrackingHistoryPanel() {
  const table = useAppTableHandlers({
    initialPageIndex: 0,
    initialPageSize: 20,
    initialDensity: "xs",
    resetPageOnSearch: true,
  });

  const filters = useAppStateHandlers<TrackingHistoryFiltersState>(
    TRACKING_HISTORY_FILTERS_DEFAULT,
  );

  const tecnicosQuery = useGetReporteTicketTecnicos();

  const tecnicoOptions = React.useMemo(
    () =>
      (tecnicosQuery.data ?? []).map((tecnico) => ({
        value: tecnico.id,
        label: tecnico.nombre,
      })),
    [tecnicosQuery.data],
  );

  const queryParams = React.useMemo(
    () =>
      toTrackingHistoryQueryParams({
        pageIndex: table.pagination.pageIndex,
        pageSize: table.pagination.pageSize,
        search: table.serverSearch,
        filters: filters.state,
      }),
    [
      filters.state,
      table.pagination.pageIndex,
      table.pagination.pageSize,
      table.serverSearch,
    ],
  );

  const historyQuery = useGetTrackingHistory(queryParams);

  const columns = React.useMemo(() => createTrackingHistoryColumns(), []);

  const handleFilterChange = <TKey extends keyof TrackingHistoryFiltersState>(
    key: TKey,
    value: TrackingHistoryFiltersState[TKey],
  ) => {
    filters.setField(key, value);
    table.resetPage();
  };

  const hasActiveFilters =
    Boolean(table.search.trim()) ||
    filters.state.tecnicoId !== null ||
    filters.state.estadoSesion !== null ||
    filters.state.fecha.start !== null ||
    filters.state.fecha.end !== null;

  const handleClearFilters = () => {
    filters.reset(TRACKING_HISTORY_FILTERS_DEFAULT);
    table.handleSearchChange("");
    table.handleDebouncedSearch("");
    table.resetPage();
  };

  return (
    <AppStack gap="sm">
      <TrackingHistoryFilters
        search={table.search}
        filters={filters.state}
        tecnicoOptions={tecnicoOptions}
        isLoadingTecnicos={tecnicosQuery.isLoading}
        isSearching={historyQuery.isFetching}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={table.handleSearchChange}
        onDebouncedSearchChange={table.handleDebouncedSearch}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      <TrackingHistoryTable
        data={historyQuery.data?.items ?? EMPTY_ITEMS}
        columns={columns}
        totalRows={historyQuery.data?.total ?? 0}
        table={table}
        isLoading={historyQuery.isPending}
        isFetching={historyQuery.isFetching}
        error={historyQuery.error}
        onRetry={() => historyQuery.refetch()}
      />
    </AppStack>
  );
}
