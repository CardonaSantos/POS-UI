import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";

import { AppContainer } from "@/components/app/primitives/app-container";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { useGetInstalacionesPaginated } from "@/Crm/CrmHooks/hooks/instalaciones/instalaciones-hook";
import type {
  ClienteInstalacionListItem,
  PaginationMeta,
} from "@/Crm/features/instalaciones/instalaciones.interfaces";

import {
  INSTALACIONES_LIST_FILTERS_DEFAULT,
  type InstalacionesListFiltersState,
  toInstalacionesQueryParams,
} from "../filters/instalaciones-list.filters";
import { InstalacionesMetrics } from "../metrics/metricas";
import { InstalacionesListFilters } from "../filters/instalaciones-list-filters";
import { INSTALACIONES_ROUTES } from "../filters/routes";
import { InstalacionesTable } from "./instalaciones-tabla";
import { createInstalacionesTableColumns } from "./instalaciones-table.columns";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

const EMPTY_ITEMS: ClienteInstalacionListItem[] = [];

const EMPTY_META: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

function InstalacionesListPage() {
  const navigate = useNavigate();

  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  const table = useAppTableHandlers({
    initialPageIndex: 0,
    initialPageSize: 10,
    initialDensity: "xs",
    resetPageOnSearch: true,
  });

  const filters = useAppStateHandlers<InstalacionesListFiltersState>(
    INSTALACIONES_LIST_FILTERS_DEFAULT,
  );

  const columns = useMemo(
    () =>
      createInstalacionesTableColumns({
        onViewInstalacion: (instalacionId) => {
          navigate(INSTALACIONES_ROUTES.detalle(instalacionId));
        },
      }),
    [navigate],
  );

  const queryParams = useMemo(
    () =>
      toInstalacionesQueryParams({
        empresaId,

        pageIndex: table.pagination.pageIndex,

        pageSize: table.pagination.pageSize,

        search: table.serverSearch,

        filters: filters.state,
      }),
    [
      empresaId,
      table.pagination.pageIndex,
      table.pagination.pageSize,
      table.serverSearch,
      filters.state,
    ],
  );

  const instalacionesQuery = useGetInstalacionesPaginated(queryParams);

  const items = instalacionesQuery.data?.data ?? EMPTY_ITEMS;

  const meta = instalacionesQuery.data?.meta ?? EMPTY_META;

  const handleFilterChange = <TKey extends keyof InstalacionesListFiltersState>(
    key: TKey,
    value: InstalacionesListFiltersState[TKey],
  ) => {
    filters.setField(key, value);
    table.resetPage();
  };

  const hasActiveFilters =
    Boolean(table.search.trim()) ||
    filters.state.estado !== null ||
    filters.state.tipo !== null ||
    filters.state.fechaProgramada.start !== null ||
    filters.state.fechaProgramada.end !== null ||
    filters.state.fechaFinalizacion.start !== null ||
    filters.state.fechaFinalizacion.end !== null;

  const handleClearFilters = () => {
    filters.reset(INSTALACIONES_LIST_FILTERS_DEFAULT);

    table.handleSearchChange("");
    table.handleDebouncedSearch("");

    table.resetPage();
  };

  return (
    <PageTransitionCrm titleHeader="Instalaciones" variant="fade-pure">
      <AppContainer size="xl" paddingX="sm" paddingY="sm">
        <AppStack gap="md">
          <InstalacionesMetrics items={items} meta={meta} />

          <InstalacionesListFilters
            search={table.search}
            filters={filters.state}
            isSearching={instalacionesQuery.isFetching}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={table.handleSearchChange}
            onDebouncedSearchChange={table.handleDebouncedSearch}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          <InstalacionesTable
            data={items}
            columns={columns}
            totalRows={meta.total}
            table={table}
            isLoading={instalacionesQuery.isPending}
            isFetching={instalacionesQuery.isFetching}
            error={instalacionesQuery.error}
            onRetry={() => instalacionesQuery.refetch()}
          />
        </AppStack>
      </AppContainer>
    </PageTransitionCrm>
  );
}

export default InstalacionesListPage;
