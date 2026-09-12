import { useMemo } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";

import { AppContainer } from "@/components/app/primitives/app-container";

import { AppStack } from "@/components/app/primitives/app-stack";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { useGetPppoeCuentas } from "@/Crm/CrmHooks/hooks/pppoe-cuentas/pppoe-cuentas-hook";

import { useGetPerfilesHomologacionSeleccionables } from "@/Crm/CrmHooks/hooks/pppoe-administracion/pppoe-administracion-hook";

import {
  PPPOE_CUENTAS_LIST_FILTERS_DEFAULT,
  toPppoeCuentasQueryParams,
  type PppoeCuentasListFiltersState,
} from "@/Crm/features/pppoe-cuentas/pppoe-cuentas.filters";

import type {
  PppoeCuentaListItem,
  PppoeCuentasPaginationMeta,
} from "@/Crm/features/pppoe-cuentas/pppoe-cuentas.interfaces";

import { PppoeCuentasListFilters } from "./pppoe-cuentas-list-filters";

import { PppoeCuentasTable } from "./pppoe-cuentas-table";

import { createPppoeCuentasTableColumns } from "./pppoe-cuentas-table.columns";
import { useAuthorization } from "@/Crm/CrmAuthRoutes/auth/use-authorization";
import { CRM_PERMISSION } from "@/Crm/CrmAuthRoutes/auth/crm-permissions";
import { AppButton } from "@/components/app/primitives/app-button";
import { Link2, Plus } from "lucide-react";
import { AppInline } from "@/components/app/primitives/app-inline";

const EMPTY_ITEMS: PppoeCuentaListItem[] = [];

const EMPTY_META: PppoeCuentasPaginationMeta = {
  total: 0,

  page: 1,

  limit: 10,

  totalPages: 0,
};

export default function PppoeCuentasListPage() {
  const navigate = useNavigate();

  const { can } = useAuthorization();

  const canCreatePppoe = can(CRM_PERMISSION.PPPOE_ACTIVAR_INICIAL);

  const table = useAppTableHandlers({
    initialPageIndex: 0,

    initialPageSize: 10,

    initialDensity: "xs",

    resetPageOnSearch: true,
  });

  const filters = useAppStateHandlers<PppoeCuentasListFiltersState>(
    PPPOE_CUENTAS_LIST_FILTERS_DEFAULT,
  );

  const homologacionesQuery = useGetPerfilesHomologacionSeleccionables();

  const homologaciones = homologacionesQuery.data ?? [];

  /**
   * Servicios presentes en homologaciones PPPoE.
   *
   * No mostramos servicios que no puedan resolverse
   * actualmente hacia un perfil RouterOS.
   */
  const servicioOptions = useMemo(() => {
    const unique = new Map<
      number,
      {
        value: number;
        label: string;
      }
    >();

    for (const item of homologaciones) {
      const servicio = item.servicioInternet;

      if (unique.has(servicio.id)) {
        continue;
      }

      const velocidad = servicio.velocidad?.trim();

      unique.set(servicio.id, {
        value: servicio.id,

        label: velocidad
          ? `${servicio.nombre} · ${velocidad}`
          : servicio.nombre,
      });
    }

    return Array.from(unique.values());
  }, [homologaciones]);

  /**
   * Routers actualmente presentes en alguna
   * homologación seleccionable.
   */
  const routerOptions = useMemo(() => {
    const unique = new Map<
      number,
      {
        value: number;
        label: string;
      }
    >();

    for (const item of homologaciones) {
      const router = item.mikrotikRouter;

      if (unique.has(router.id)) {
        continue;
      }

      unique.set(router.id, {
        value: router.id,

        label: router.nombre,
      });
    }

    return Array.from(unique.values());
  }, [homologaciones]);

  /**
   * Los perfiles sí son dependientes de los filtros
   * de servicio y router.
   *
   * Esto evita mostrar PF20M de un router distinto
   * cuando ya se seleccionó infraestructura concreta.
   */
  const perfilOptions = useMemo(() => {
    return homologaciones
      .filter((item) => {
        if (
          filters.state.servicioInternetId !== null &&
          item.servicioInternetId !== filters.state.servicioInternetId
        ) {
          return false;
        }

        if (
          filters.state.mikrotikRouterId !== null &&
          item.mikrotikRouterId !== filters.state.mikrotikRouterId
        ) {
          return false;
        }

        return true;
      })
      .map((item) => ({
        value: item.id,

        label: `${item.codigoPerfil} · ${item.servicioInternet.nombre} · ${item.mikrotikRouter.nombre}`,
      }));
  }, [
    homologaciones,
    filters.state.mikrotikRouterId,
    filters.state.servicioInternetId,
  ]);

  const columns = useMemo(() => createPppoeCuentasTableColumns(), []);

  const queryParams = useMemo(
    () =>
      toPppoeCuentasQueryParams({
        pageIndex: table.pagination.pageIndex,

        pageSize: table.pagination.pageSize,

        search: table.serverSearch,

        filters: filters.state,
      }),
    [
      table.pagination.pageIndex,

      table.pagination.pageSize,

      table.serverSearch,

      filters.state,
    ],
  );

  const cuentasQuery = useGetPppoeCuentas(queryParams);

  const items = cuentasQuery.data?.data ?? EMPTY_ITEMS;

  const meta = cuentasQuery.data?.meta ?? EMPTY_META;

  const handleFilterChange = <TKey extends keyof PppoeCuentasListFiltersState>(
    key: TKey,

    value: PppoeCuentasListFiltersState[TKey],
  ) => {
    /**
     * Perfil depende de router + servicio.
     *
     * Si cambia cualquiera de ambos,
     * descartamos el perfil previamente seleccionado
     * para no mantener combinaciones inconsistentes.
     */
    if (key === "servicioInternetId" || key === "mikrotikRouterId") {
      filters.patch({
        [key]: value,

        perfilHomologacionId: null,
      } as Partial<PppoeCuentasListFiltersState>);
    } else {
      filters.setField(key, value);
    }

    table.resetPage();
  };

  const hasActiveFilters =
    Boolean(table.search.trim()) ||
    filters.state.clienteId !== null ||
    filters.state.servicioInternetId !== null ||
    filters.state.mikrotikRouterId !== null ||
    filters.state.perfilHomologacionId !== null ||
    filters.state.estadoCuenta !== null ||
    filters.state.estadoAcceso !== null ||
    filters.state.origen !== null;

  const handleClearFilters = () => {
    filters.reset(PPPOE_CUENTAS_LIST_FILTERS_DEFAULT);

    table.handleSearchChange("");

    table.handleDebouncedSearch("");

    table.resetPage();
  };

  const handleViewCuenta = (cuentaPppoeId: number) => {
    navigate(`/crm/pppoe/cuentas/${cuentaPppoeId}`);
  };

  return (
    <PageTransitionCrm titleHeader="Cuentas PPPoE" variant="fade-pure">
      <AppContainer size="xl" paddingX="sm" paddingY="sm">
        <AppStack gap="md">
          <AppInline
            justify="between"
            align="start"
            collapseBelow="sm"
            gap="sm"
            fullWidth
          >
            <div className="min-w-0">
              <h1 className="text-lg font-semibold">Cuentas PPPoE</h1>

              <p className="mt-1 text-sm text-[hsl(var(--app-muted-foreground))]">
                Administración de accesos, cuentas, estados y provisionamiento
                PPPoE.
              </p>
            </div>

            {canCreatePppoe ? (
              <AppInline gap="xs" wrap>
                <AppButton
                  asChild
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Link2 size={14} aria-hidden="true" />}
                >
                  <Link to="/crm/pppoe/cuentas/adoptar">Adoptar existente</Link>
                </AppButton>

                <AppButton
                  asChild
                  type="button"
                  size="sm"
                  leftIcon={<Plus size={14} aria-hidden="true" />}
                >
                  <Link to="/crm/pppoe/cuentas/nueva">Nueva cuenta PPPoE</Link>
                </AppButton>
              </AppInline>
            ) : null}
          </AppInline>

          <PppoeCuentasListFilters
            search={table.search}
            filters={filters.state}
            servicioOptions={servicioOptions}
            routerOptions={routerOptions}
            perfilOptions={perfilOptions}
            isLoadingHomologaciones={homologacionesQuery.isLoading}
            isSearching={cuentasQuery.isFetching}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={table.handleSearchChange}
            onDebouncedSearchChange={table.handleDebouncedSearch}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          <PppoeCuentasTable
            data={items}
            columns={columns}
            totalRows={meta.total}
            table={table}
            isLoading={cuentasQuery.isPending}
            isFetching={cuentasQuery.isFetching}
            error={cuentasQuery.error}
            onRetry={() => cuentasQuery.refetch()}
            onViewCuenta={handleViewCuenta}
          />
        </AppStack>
      </AppContainer>
    </PageTransitionCrm>
  );
}
