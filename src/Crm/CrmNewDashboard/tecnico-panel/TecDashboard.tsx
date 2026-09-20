import { RefreshCw } from "lucide-react";

import { PageTransitionCrm } from "@/components/Layout/page-transition";

import { AppButton } from "@/components/app/primitives/app-button";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppStack } from "@/components/app/primitives/app-stack";
import { useGetTecnicoPanel } from "@/Crm/CrmHooks/hooks/dashboard/useDashboard";
import { formatTecnicoPanelPeriodo } from "./helpers/tecnico-dashboard.utils";
import { TecnicoQuickActions } from "./components/tecnico-quick-actions";
import { TecnicoCargaActual } from "./components/tecnico-carga-actual";
import { TecnicoProductividad } from "./components/tecnico-productividad";
import { TecnicoTiempos } from "./components/tecnico-tiempos";
import { TecnicoResumenActividad } from "./components/tecnico-resumen-actividad";
import { TecnicoActividadChart } from "@/charts/panel-tecnico/tecnico-actividad-chart";

function TecDashboard() {
  const query = useGetTecnicoPanel();

  const data = query.data;

  return (
    <PageTransitionCrm
      titleHeader="Panel técnico"
      fallbackBackTo="/crm"
      variant="crm-soft"
      stickyHeader
      actions={
        <AppButton
          type="button"
          size="xs"
          variant="secondary"
          disabled={query.isFetching}
          onClick={() => query.refetch()}
        >
          <RefreshCw
            className={[
              "size-3.5",
              query.isFetching ? "animate-spin" : "",
            ].join(" ")}
            aria-hidden="true"
          />
          Actualizar
        </AppButton>
      }
    >
      <AppContainer size="xl" paddingX="none" paddingY="none">
        <AppDataState
          isLoading={query.isPending}
          isFetching={query.isFetching}
          error={query.error}
          isEmpty={Boolean(query.data) && !data}
          onRetry={() => query.refetch()}
          loadingVariant="skeleton-grid"
          variant="plain"
          size="sm"
          minHeight="lg"
          emptyTitle="Panel no disponible"
          emptyDescription="No fue posible obtener información para el técnico autenticado."
        >
          {data ? (
            <AppStack gap="md">
              {/* ========================================= */}
              {/* IDENTIDAD / PERÍODO */}
              {/* ========================================= */}

              <div>
                <p className="text-base font-semibold">{data.tecnico.nombre}</p>

                <p className="mt-0.5 text-xs text-[hsl(var(--app-muted-foreground))]">
                  {formatTecnicoPanelPeriodo(data.periodo)}
                </p>
              </div>

              {/* ========================================= */}
              {/* ACCESOS PRINCIPALES */}
              {/* ========================================= */}

              <TecnicoQuickActions carga={data.cargaActual} />

              {/* ========================================= */}
              {/* CARGA OPERATIVA */}
              {/* ========================================= */}

              <TecnicoCargaActual data={data.cargaActual} />

              {/* ========================================= */}
              {/* PRODUCTIVIDAD + TIEMPOS */}
              {/* ========================================= */}

              <AppGrid
                cols={{
                  base: 1,
                  lg: 2,
                }}
                gap="sm"
              >
                <TecnicoProductividad data={data.productividadMes} />

                <TecnicoTiempos data={data.tiempos} />
              </AppGrid>

              {/* ========================================= */}
              {/* ACTIVIDAD */}
              {/* ========================================= */}
              <AppGrid
                cols={{
                  base: 1,
                  xl: 2,
                }}
                gap="sm"
              >
                <TecnicoResumenActividad data={data.resumenActividad} />

                <TecnicoActividadChart data={data.actividadDiaria} />
              </AppGrid>
            </AppStack>
          ) : null}
        </AppDataState>
      </AppContainer>
    </PageTransitionCrm>
  );
}

export default TecDashboard;
