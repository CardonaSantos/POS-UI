import { useCallback, useMemo, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  useAppDisclosure,
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppContainer } from "@/components/app/primitives/app-container";

import { AppStack } from "@/components/app/primitives/app-stack";

import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";

import { useGetDesinstalacionesPaginated } from "@/Crm/CrmHooks/hooks/desinstalaciones/desinstalaciones-hook";

import type { ClienteDesinstalacionListItem } from "@/Crm/features/desinstalaciones/desinstalaciones.interfaces";
import {
  DESINSTALACIONES_LIST_FILTERS_DEFAULT,
  DesinstalacionesListFiltersState,
  toDesinstalacionesQueryParams,
} from "./filters/desinstalaciones-list-filters";
import { createDesinstalacionesTableColumns } from "./table/desinstalaciones-table.columns";
import { DESINSTALACIONES_ROUTES } from "./table/routes.route";
import { DesinstalacionesTable } from "./table/desinstalaciones-table";
import { PaginationMeta } from "../features/instalaciones/instalaciones.interfaces";
import { DesinstalacionesListFilters } from "./filttros";
import { SolicitarAutorizacionDesinstalacionDialog } from "./actions/solicitar-autorizacion-desinstalacion-dialog";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppButton } from "@/components/app/primitives/app-button";

const EMPTY_ITEMS: ClienteDesinstalacionListItem[] = [];

const EMPTY_META: PaginationMeta = {
  total: 0,

  page: 1,

  limit: 10,

  totalPages: 0,
};

function DesinstalacionesListPage() {
  const navigate = useNavigate();

  const solicitudAutorizacionDialog = useAppDisclosure();

  const [solicitudAutorizacionTarget, setSolicitudAutorizacionTarget] =
    useState<ClienteDesinstalacionListItem | null>(null);

  const handleSolicitarAutorizacion = useCallback(
    (desinstalacion: ClienteDesinstalacionListItem) => {
      setSolicitudAutorizacionTarget(desinstalacion);

      solicitudAutorizacionDialog.open();
    },
    [solicitudAutorizacionDialog.open],
  );

  const handleSolicitudAutorizacionOpenChange = useCallback(
    (open: boolean) => {
      solicitudAutorizacionDialog.setOpen(open);

      if (!open) {
        setSolicitudAutorizacionTarget(null);
      }
    },
    [solicitudAutorizacionDialog.setOpen],
  );

  const handleSolicitudAutorizacionCompleted = useCallback(() => {
    solicitudAutorizacionDialog.setOpen(false);

    setSolicitudAutorizacionTarget(null);
  }, [solicitudAutorizacionDialog.setOpen]);

  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;

  /*
   * ========================================================
   * TABLE CONTROLLER
   * ========================================================
   */
  const table = useAppTableHandlers({
    initialPageIndex: 0,

    initialPageSize: 10,

    initialDensity: "xs",

    resetPageOnSearch: true,
  });

  /*
   * ========================================================
   * FILTER CONTROLLER
   * ========================================================
   */
  const filters = useAppStateHandlers(DESINSTALACIONES_LIST_FILTERS_DEFAULT);

  /*
   * ========================================================
   * COLUMNS
   * ========================================================
   *
   * No se recrean cada vez que cambia:
   *
   * - búsqueda;
   * - página;
   * - filtros;
   * - query;
   *
   * Solamente dependen de navigate.
   */
  const columns = useMemo(
    () =>
      createDesinstalacionesTableColumns({
        onViewDesinstalacion: (desinstalacionId) => {
          navigate(DESINSTALACIONES_ROUTES.detalle(desinstalacionId));
        },

        onSolicitarAutorizacion: handleSolicitarAutorizacion,
      }),
    [handleSolicitarAutorizacion, navigate],
  );

  /*
   * ========================================================
   * QUERY PARAMS
   * ========================================================
   */
  const queryParams = useMemo(
    () =>
      toDesinstalacionesQueryParams({
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

  /*
   * ========================================================
   * SERVER QUERY
   * ========================================================
   */
  const desinstalacionesQuery = useGetDesinstalacionesPaginated(queryParams);

  const items = desinstalacionesQuery.data?.data ?? EMPTY_ITEMS;

  const meta = desinstalacionesQuery.data?.meta ?? EMPTY_META;

  /*
   * ========================================================
   * FILTER HANDLERS
   * ========================================================
   */
  const handleFilterChange = <
    TKey extends keyof DesinstalacionesListFiltersState,
  >(
    key: TKey,

    value: DesinstalacionesListFiltersState[TKey],
  ) => {
    filters.setField(key, value);

    table.resetPage();
  };

  const hasActiveFilters =
    Boolean(table.search.trim()) ||
    filters.state.estado !== null ||
    filters.state.tipo !== null ||
    filters.state.motivo !== null ||
    filters.state.fechaProgramada.start !== null ||
    filters.state.fechaProgramada.end !== null ||
    filters.state.fechaFinalizacion.start !== null ||
    filters.state.fechaFinalizacion.end !== null;

  const handleClearFilters = () => {
    filters.reset(DESINSTALACIONES_LIST_FILTERS_DEFAULT);

    table.handleSearchChange("");

    table.handleDebouncedSearch("");

    table.resetPage();
  };

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */
  return (
    <PageTransitionCrm titleHeader="Desinstalaciones" variant="fade-pure">
      <AppContainer size="full" paddingX="none" paddingY="none">
        <AppStack gap="sm">
          <AppInline justify="end" fullWidth>
            <AppButton asChild>
              <Link to="/crm/crear-desinstalacion">Nueva desinstalacion</Link>
            </AppButton>
          </AppInline>

          <DesinstalacionesListFilters
            search={table.search}
            filters={filters.state}
            isSearching={desinstalacionesQuery.isFetching}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={table.handleSearchChange}
            onDebouncedSearchChange={table.handleDebouncedSearch}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          <DesinstalacionesTable
            data={items}
            columns={columns}
            totalRows={meta.total}
            table={table}
            isLoading={desinstalacionesQuery.isPending}
            isFetching={desinstalacionesQuery.isFetching}
            error={desinstalacionesQuery.error}
            onRetry={() => desinstalacionesQuery.refetch()}
          />
        </AppStack>

        {solicitudAutorizacionTarget ? (
          <SolicitarAutorizacionDesinstalacionDialog
            desinstalacionId={solicitudAutorizacionTarget.id}
            open={solicitudAutorizacionDialog.isOpen}
            onOpenChange={handleSolicitudAutorizacionOpenChange}
            onCompleted={handleSolicitudAutorizacionCompleted}
          />
        ) : null}
      </AppContainer>
    </PageTransitionCrm>
  );
}

export default DesinstalacionesListPage;
