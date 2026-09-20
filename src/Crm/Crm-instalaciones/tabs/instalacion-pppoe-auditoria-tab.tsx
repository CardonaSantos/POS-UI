import { useCallback, useMemo } from "react";

import { useAppStateHandlers } from "@/components/app/handlers";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppStack } from "@/components/app/primitives/app-stack";

import { useGetAuditoriaPppoeInstalacion } from "@/Crm/CrmHooks/hooks/pppoe-auditoria/pppoe-auditoria-instalacion-hook";

import {
  INSTALACION_PPPOE_AUDITORIA_FILTER_DEFAULTS,
  type FiltrarAuditoriaPppoeInstalacionParams,
  type InstalacionPppoeAuditoriaFilters,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.filters";
import { AuditoriaSummary } from "../auditoria/auditoria-summary";
import { AuditoriaTimeline } from "../auditoria/auditoria-timeline";
import { AuditoriaFilters } from "../auditoria/auditoria-filters";
import { AuditoriaPagination } from "../auditoria/auditoria-pagination";

type Props = {
  instalacionId: number;
  enabled: boolean;
};

export function InstalacionPppoeAuditoriaTab({
  instalacionId,
  enabled,
}: Props) {
  const filters = useAppStateHandlers<InstalacionPppoeAuditoriaFilters>(
    INSTALACION_PPPOE_AUDITORIA_FILTER_DEFAULTS,
  );

  const { state, patch, reset, setField } = filters;

  const queryParams = useMemo<FiltrarAuditoriaPppoeInstalacionParams>(
    () => ({
      page: state.page,
      limit: state.limit,
      search: state.serverSearch || undefined,
      tipoOperacion: state.tipoOperacion ?? undefined,
      estadoOperacion: state.estadoOperacion ?? undefined,
      accion: state.accion ?? undefined,
      origen: state.origen ?? undefined,
      fechaDesde: state.fecha.start || undefined,
      fechaHasta: state.fecha.end || undefined,
      ordenDireccion: state.ordenDireccion,
    }),
    [
      state.accion,
      state.estadoOperacion,
      state.fecha.end,
      state.fecha.start,
      state.limit,
      state.ordenDireccion,
      state.origen,
      state.page,
      state.serverSearch,
      state.tipoOperacion,
    ],
  );

  const query = useGetAuditoriaPppoeInstalacion(
    instalacionId,
    queryParams,
    enabled,
  );

  const changeFilter = useCallback(
    <K extends keyof InstalacionPppoeAuditoriaFilters>(
      key: K,
      value: InstalacionPppoeAuditoriaFilters[K],
    ) => {
      patch({
        [key]: value,
        page: 1,
      } as Partial<InstalacionPppoeAuditoriaFilters>);
    },
    [patch],
  );

  const handleSearchDebounced = useCallback(
    (value: string) => {
      patch({
        serverSearch: value,
        page: 1,
      });
    },
    [patch],
  );

  const handleClear = useCallback(() => {
    reset(INSTALACION_PPPOE_AUDITORIA_FILTER_DEFAULTS);
  }, [reset]);

  const handlePrevious = useCallback(() => {
    setField("page", (current) => Math.max(current - 1, 1));
  }, [setField]);

  const handleNext = useCallback(() => {
    setField("page", (current) =>
      Math.min(current + 1, query.data?.meta.totalPages ?? current),
    );
  }, [query.data?.meta.totalPages, setField]);

  const hasActiveFilters =
    Boolean(state.search.trim()) ||
    state.tipoOperacion !== null ||
    state.estadoOperacion !== null ||
    state.accion !== null ||
    state.origen !== null ||
    Boolean(state.fecha.start) ||
    Boolean(state.fecha.end) ||
    state.ordenDireccion !== "desc" ||
    state.limit !== INSTALACION_PPPOE_AUDITORIA_FILTER_DEFAULTS.limit;

  if (!enabled) return null;

  const response = query.data;
  const summary = response?.summary ?? null;
  const items = response?.data ?? [];

  return (
    <AppStack gap="sm">
      <AuditoriaFilters
        filters={state}
        isFetching={query.isFetching}
        hasActiveFilters={hasActiveFilters}
        onSearchChange={(value) => setField("search", value)}
        onSearchDebouncedChange={handleSearchDebounced}
        onTipoOperacionChange={(value) => changeFilter("tipoOperacion", value)}
        onEstadoOperacionChange={(value) =>
          changeFilter("estadoOperacion", value)
        }
        onAccionChange={(value) => changeFilter("accion", value)}
        onOrigenChange={(value) => changeFilter("origen", value)}
        onFechaChange={(value) => changeFilter("fecha", value)}
        onOrdenChange={(value) => changeFilter("ordenDireccion", value)}
        onLimitChange={(value) => changeFilter("limit", value)}
        onClear={handleClear}
        onRefresh={() => query.refetch()}
      />

      <AppDataState
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        error={query.error}
        isEmpty={Boolean(response) && !summary}
        onRetry={() => query.refetch()}
        loadingVariant="skeleton-grid"
        emptyTitle="Auditoría no disponible"
        emptyDescription="No existe una instalación accesible para este identificador."
        variant="plain"
        size="sm"
        minHeight="lg"
      >
        {summary ? (
          <AppStack gap="sm">
            <AuditoriaSummary summary={summary} />

            {items.length > 0 ? (
              <AuditoriaTimeline items={items} />
            ) : (
              <AppEmptyState
                title="Sin registros para estos filtros"
                description="La instalación tiene contexto PPPoE, pero no existen operaciones o eventos que coincidan con los criterios actuales."
              />
            )}

            {response ? (
              <AuditoriaPagination
                page={response.meta.page}
                totalPages={response.meta.totalPages}
                total={response.meta.total}
                isFetching={query.isFetching}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            ) : null}
          </AppStack>
        ) : null}
      </AppDataState>
    </AppStack>
  );
}
