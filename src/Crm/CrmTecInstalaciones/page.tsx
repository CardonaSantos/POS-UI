import { useCallback, useMemo } from "react";
import { SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppStateHandlers } from "@/components/app/handlers";
import type { EstadoInstalacionCliente } from "@/Crm/features/instalaciones/enums";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppEmptyState } from "@/components/app/primitives/app-empty-state";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useGetInstalacionesTecnicasAsignadas } from "../CrmHooks/hooks/instalaciones/instalaciones-hook";
import { InstalacionesList } from "./components/instalaciones-list";
import { InstalacionesPageSkeleton } from "./components/instalaciones-page-skeleton";
import { InstalacionesPagination } from "./components/instalaciones-pagination";
import { InstalacionesSummary } from "./components/instalaciones-summary";
import { InstalacionesToolbar } from "./components/instalaciones-toolbar";
import {
  EMPTY_INSTALLATIONS,
  PAGE_SIZE,
  type FiltrosInstalacionesState,
} from "./tecnico-instalaciones.constants";
import { buildInstalacionesSummary } from "./tecnico-instalaciones.utils";
import { PageTransitionCrm } from "@/components/Layout/page-transition";

export default function TecnicoInstalacionesPage() {
  const navigate = useNavigate();
  const filtros = useAppStateHandlers<FiltrosInstalacionesState>({
    page: 1,
    search: "",
    serverSearch: "",
    estado: undefined,
  });
  const { state, patch, reset, search, setField } = filtros;

  const queryParams = useMemo(
    () => ({
      page: state.page,
      limit: PAGE_SIZE,
      search: state.serverSearch || undefined,
      estado: state.estado,
    }),
    [state.estado, state.page, state.serverSearch],
  );

  const instalacionesQuery = useGetInstalacionesTecnicasAsignadas(queryParams);
  const instalaciones = instalacionesQuery.data?.data ?? EMPTY_INSTALLATIONS;
  const meta = instalacionesQuery.data?.meta;

  const summary = useMemo(
    () => buildInstalacionesSummary(instalaciones),
    [instalaciones],
  );

  const handleDebouncedSearch = useCallback(
    (value: string) => {
      patch({ serverSearch: value, page: 1 });
    },
    [patch],
  );

  const handleEstadoChange = useCallback(
    (estado: EstadoInstalacionCliente | undefined) => {
      patch({ estado, page: 1 });
    },
    [patch],
  );

  const handlePreviousPage = useCallback(() => {
    setField("page", (current) => Math.max(current - 1, 1));
  }, [setField]);

  const handleNextPage = useCallback(() => {
    setField("page", (current) =>
      Math.min(current + 1, meta?.totalPages ?? current),
    );
  }, [meta?.totalPages, setField]);

  const handleOpenInstallation = useCallback(
    (instalacionId: number) => {
      navigate(String(instalacionId));
    },
    [navigate],
  );

  const handleClearFilters = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <PageTransitionCrm
      titleHeader={`Instalaciones asignadas`}
      // subtitle={`${summary.overdue}`}
      variant="fade-pure"
    >
      <AppContainer paddingX="sm" paddingY="sm">
        <AppStack gap="md">
          <InstalacionesToolbar
            search={state.search}
            estado={state.estado}
            isSearching={instalacionesQuery.isFetching}
            onSearchChange={search("search")}
            onDebouncedSearch={handleDebouncedSearch}
            onEstadoChange={handleEstadoChange}
          />

          {instalacionesQuery.isLoading ? (
            <InstalacionesPageSkeleton />
          ) : (
            <>
              {!instalacionesQuery.error && instalaciones.length > 0 ? (
                <InstalacionesSummary
                  summary={summary}
                  visibleCount={instalaciones.length}
                />
              ) : null}

              {instalacionesQuery.error ? (
                <AppDataState
                  error={instalacionesQuery.error}
                  onRetry={() => instalacionesQuery.refetch()}
                >
                  <div />
                </AppDataState>
              ) : instalaciones.length === 0 ? (
                <AppEmptyState
                  preset={
                    state.serverSearch || state.estado ? "search" : "empty"
                  }
                  variant="soft"
                  title={
                    state.serverSearch || state.estado
                      ? "Sin coincidencias"
                      : "No tienes instalaciones asignadas"
                  }
                  description={
                    state.serverSearch || state.estado
                      ? "Prueba otra búsqueda o limpia los filtros."
                      : "Las nuevas asignaciones aparecerán aquí."
                  }
                  action={
                    state.serverSearch || state.estado ? (
                      <AppButton
                        variant="outline"
                        size="sm"
                        onClick={handleClearFilters}
                      >
                        <SearchX aria-hidden="true" />
                        Limpiar filtros
                      </AppButton>
                    ) : undefined
                  }
                />
              ) : (
                <AppDataState isFetching={instalacionesQuery.isFetching}>
                  <InstalacionesList
                    instalaciones={instalaciones}
                    onOpen={handleOpenInstallation}
                  />
                </AppDataState>
              )}

              {meta && meta.totalPages > 0 ? (
                <InstalacionesPagination
                  meta={meta}
                  isFetching={instalacionesQuery.isFetching}
                  onPrevious={handlePreviousPage}
                  onNext={handleNextPage}
                />
              ) : null}
            </>
          )}
        </AppStack>
      </AppContainer>
    </PageTransitionCrm>
  );
}
