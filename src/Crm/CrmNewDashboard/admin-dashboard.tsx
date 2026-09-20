"use client";

import * as React from "react";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";

import { fadeElegant } from "@/components/Layout/page-transition";

import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppContainer } from "@/components/app/primitives/app-container";
import { AppDataState } from "@/components/app/primitives/app-data-state";
import { AppStack } from "@/components/app/primitives/app-stack";

import {
  useGetCobrosDashboard,
  useGetDashboardActividadHistorica,
  useGetDashboardActividadMes,
  useGetDashboardData,
  useGetDashboardTicketsActividad,
  useGetTicketProceso,
} from "../CrmHooks/hooks/dashboard/useDashboard";

import { useGetUsersRealTime } from "../CrmHooks/hooks/use-real-time-location/use-real-time-location";
import { useInvalidateQk } from "../CrmHooks/hooks/useInvalidateQk/useInvalidateQk";

import {
  DashboardQkeys,
  TicketsProcesoQkeys,
} from "../CrmHooks/hooks/dashboard/Qk";

import { realTimeQkeys } from "../CrmHooks/hooks/use-real-time-location/Qk";

import { useSocketEvent } from "../WEB/SocketProvider";
import { showTicketBrowserNotification } from "../WEB/browserNotifications";

import { DashboardRoutesSidebar } from "./_components/DashboardRoutesSidebar";
import { DashboardSupportSidebar } from "./_components/DashboardSupportSidebar";
import { DashboardChartsGrid } from "./_components/DashboardChartsGrid";
import { DashboardKpisSection } from "./_components/DashboardKpisSection";
import { DashboardMapPanel } from "./_components/dashboard-charts-grids";

import type {
  DashboardCobrosResponse,
  DashboardData,
} from "../features/dashboard/dashboard.interfaces";
import type { RealTimeLocationRaw } from "../features/real-time-location/real-time-location";
import type { TicketsDashboardSoporte } from "./interfaces/dashboard-interfaces";
import {
  DashboardTicketsActividadParams,
  DashboardTicketsActividadPreset,
} from "../features/chart-types/tickets-chart";
import { DashboardTicketsActivity } from "../_charts/dashboard-tickets-activity-chart/activitu-chart-ticket";

const EMPTY_COBROS_DATA: DashboardCobrosResponse = {
  rutasActiva: [],
  morosoTop: [],
};

const DEFAULT_DASHBOARD_DATA: DashboardData = {
  periodo: {
    desde: "",
    hasta: "",
    zonaHoraria: "America/Guatemala",
  },

  clientes: {
    resumen: {
      totalEnSistema: 0,
      carteraActual: 0,
    },

    servicio: {
      activos: 0,
      suspendidos: 0,
      pendientesActivacion: 0,
      enInstalacion: 0,
      desinstalados: 0,
    },

    cobranza: {
      alDia: 0,
      pagoPendiente: 0,
      atrasados: 0,
      morosos: 0,
    },
  },

  facturacion: {
    facturasEmitidasMes: 0,
    facturasPagadasMes: 0,
    montoFacturadoMes: 0,
    montoCobradoMes: 0,
    montoPendienteMes: 0,
  },
};

const EMPTY_TICKETS_SOPORTE: TicketsDashboardSoporte = {
  tickets: [],
  ticketsMetricas: {
    enLinea: 0,
  },
};

type TicketStatusChangePayload = {
  ticketId: number;
  nuevoEstado: string;
  titulo?: string;
  tecnico?: string;
};

function NewDashboard() {
  const invalidateQk = useInvalidateQk();
  const queryClient = useQueryClient();

  const [ticketsActividadParams, setTicketsActividadParams] =
    React.useState<DashboardTicketsActividadParams>({
      preset: "7D",
    });

  /**
   * Dashboard principal
   */
  const kpisQuery = useGetDashboardData();
  const ticketsQuery = useGetTicketProceso();
  const cobrosQuery = useGetCobrosDashboard();

  /**
   * Actividad de instalaciones
   */
  const actividadMesQuery = useGetDashboardActividadMes();

  const actividadHistoricaQuery = useGetDashboardActividadHistorica();

  const ticketsActividadQuery = useGetDashboardTicketsActividad(
    ticketsActividadParams,
  );

  const ticketsActividad = ticketsActividadQuery.data;
  /**
   * Ubicación en tiempo real
   */
  const locationsQuery = useGetUsersRealTime();

  /**
   * Datos core.
   *
   * Estos sí tienen fallbacks porque el dashboard operativo
   * puede representarse correctamente con valores vacíos.
   */
  const ticketsSoporte = ticketsQuery.data ?? EMPTY_TICKETS_SOPORTE;

  const cobros = cobrosQuery.data ?? EMPTY_COBROS_DATA;

  const kpisData = kpisQuery.data ?? DEFAULT_DASHBOARD_DATA;

  /**
   * Los charts NO reciben fallback [].
   *
   * Ahora el servidor retorna objetos:
   *
   * DashboardActividadMes
   * DashboardActividadHistorica
   *
   * undefined nos permite distinguir correctamente el estado
   * inicial/loading de una respuesta real.
   */
  const instalacionesMes = actividadMesQuery.data;

  const instalacionesHistoricas = actividadHistoricaQuery.data;

  const locations = React.useMemo<RealTimeLocationRaw[]>(() => {
    return Array.isArray(locationsQuery.data) ? locationsQuery.data : [];
  }, [locationsQuery.data]);

  const rutasActivas = Array.isArray(cobros.rutasActiva)
    ? cobros.rutasActiva
    : [];

  const topMorosos = Array.isArray(cobros.morosoTop) ? cobros.morosoTop : [];

  /**
   * Solamente estos recursos bloquean inicialmente
   * el contenido principal del dashboard.
   *
   * Charts y mapa son recursos secundarios y pueden
   * cargar independientemente.
   */
  const isCoreLoading =
    kpisQuery.isLoading || ticketsQuery.isLoading || cobrosQuery.isLoading;

  /**
   * Estado global de actualización.
   *
   * Aquí sí incluimos todo porque el botón "Reintentar"
   * vuelve a consultar todos los recursos.
   */
  const isRefreshing =
    kpisQuery.isFetching ||
    ticketsQuery.isFetching ||
    cobrosQuery.isFetching ||
    actividadMesQuery.isFetching ||
    actividadHistoricaQuery.isFetching ||
    ticketsActividadQuery.isFetching ||
    locationsQuery.isFetching;

  const hasCoreData = Boolean(
    kpisQuery.data || ticketsQuery.data || cobrosQuery.data,
  );

  /**
   * Solo errores del núcleo pueden provocar el
   * error global del dashboard.
   */
  const coreError =
    kpisQuery.error ?? ticketsQuery.error ?? cobrosQuery.error ?? null;

  /**
   * Cualquier recurso puede provocar la advertencia suave.
   *
   * De esta manera un fallo en:
   * - chart del mes
   * - chart histórico
   * - ubicaciones
   *
   * no destruye todo el dashboard.
   */
  const hasSoftError = Boolean(
    kpisQuery.isError ||
    ticketsQuery.isError ||
    cobrosQuery.isError ||
    actividadMesQuery.isError ||
    actividadHistoricaQuery.isError ||
    ticketsActividadQuery.isError ||
    locationsQuery.isError,
  );

  const showGlobalLoading = isCoreLoading && !hasCoreData;

  const showGlobalError = Boolean(coreError && !hasCoreData);

  const refetchAll = React.useCallback(async () => {
    await Promise.allSettled([
      kpisQuery.refetch(),
      ticketsQuery.refetch(),
      cobrosQuery.refetch(),
      actividadMesQuery.refetch(),
      actividadHistoricaQuery.refetch(),
      ticketsActividadQuery.refetch(),
      locationsQuery.refetch(),
    ]);
  }, [
    kpisQuery,
    ticketsQuery,
    cobrosQuery,
    actividadMesQuery,
    actividadHistoricaQuery,
    ticketsActividadQuery,
    locationsQuery,
  ]);
  const handleTicketStatusChange = React.useCallback(
    (payload: TicketStatusChangePayload) => {
      invalidateQk(TicketsProcesoQkeys.all);

      if (payload.nuevoEstado === "EN_PROCESO") {
        toast.success(`Ticket #${payload.ticketId} fue tomado en proceso`);
      } else if (payload.nuevoEstado === "PENDIENTE_REVISION") {
        toast.info(`Ticket #${payload.ticketId} quedó pendiente de revisión`);
      } else {
        toast.info(
          `Ticket #${payload.ticketId} cambió a ${payload.nuevoEstado}`,
        );
      }

      showTicketBrowserNotification({
        ticketId: payload.ticketId,
        nuevoEstado: payload.nuevoEstado,
        titulo: payload.titulo,
        tecnico: payload.tecnico,
      });
    },
    [invalidateQk],
  );

  const handleRutaCobroChange = React.useCallback(() => {
    invalidateQk(DashboardQkeys.cobros);
  }, [invalidateQk]);

  const handleFacturacionChange = React.useCallback(() => {
    invalidateQk(DashboardQkeys.kps);
  }, [invalidateQk]);

  const handleRealtimeLocation = React.useCallback(
    (payload: RealTimeLocationRaw) => {
      queryClient.setQueryData(
        realTimeQkeys.all,
        (oldData: RealTimeLocationRaw[] | undefined) => {
          const incoming = payload;

          if (!oldData) {
            return [incoming];
          }

          const exists = oldData.some(
            (location) => location.usuarioId === incoming.usuarioId,
          );

          if (!exists) {
            return [...oldData, incoming];
          }

          return oldData.map((location) =>
            location.usuarioId === incoming.usuarioId ? incoming : location,
          );
        },
      );
    },
    [queryClient],
  );

  const handleTicketsActividadPresetChange = React.useCallback(
    (preset: DashboardTicketsActividadPreset) => {
      setTicketsActividadParams({
        preset,
      });
    },
    [],
  );

  /**
   * Eventos realtime
   */
  useSocketEvent("ticket-soporte:change-status", handleTicketStatusChange, [
    handleTicketStatusChange,
  ]);

  useSocketEvent("ruta-cobro:change-status", handleRutaCobroChange, [
    handleRutaCobroChange,
  ]);

  useSocketEvent("facturacion:change-event", handleFacturacionChange, [
    handleFacturacionChange,
  ]);

  useSocketEvent("emit:location:real-time", handleRealtimeLocation, [
    handleRealtimeLocation,
  ]);

  return (
    <motion.div {...fadeElegant} className="min-w-0">
      <AppContainer size="full" paddingX="xs" paddingY="xs" className="min-w-0">
        <AppStack gap="xs" className="min-w-0 pb-3">
          {hasSoftError && !showGlobalError ? (
            <AppAlert
              tone="warning"
              variant="soft"
              size="xs"
              icon={<AlertTriangle className="h-4 w-4" />}
              title="Algunos datos no se pudieron actualizar"
              description="El dashboard seguirá mostrando la última información disponible."
              action={
                <AppButton
                  type="button"
                  size="xs"
                  variant="secondary"
                  loading={isRefreshing}
                  loadingText="Actualizando..."
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                  onClick={() => void refetchAll()}
                >
                  Reintentar
                </AppButton>
              }
            />
          ) : null}

          <AppDataState
            isLoading={showGlobalLoading}
            isFetching={isRefreshing}
            error={showGlobalError ? coreError : null}
            isEmpty={false}
            onRetry={() => void refetchAll()}
            loadingVariant="skeleton-grid"
            loadingRows={6}
          >
            <AppStack gap="sm" className="min-w-0">
              {/*
               * ============================================================
               * BLOQUE OPERATIVO
               * ============================================================
               *
               * Izquierda:
               *   rutas y cobranza
               *
               * Centro:
               *   KPIs generales
               *
               * Derecha:
               *   soporte
               *
               * Los charts YA NO viven dentro de esta cuadrícula.
               */}
              <section
                aria-label="Dashboard operativo"
                className={[
                  "grid min-w-0 grid-cols-1 gap-2",
                  "xl:grid-cols-[15.5rem_minmax(0,1fr)_16rem]",
                  "2xl:grid-cols-[17rem_minmax(0,1fr)_17rem]",

                  "xl:[--dashboard-panel-h:34rem]",
                  "2xl:[--dashboard-panel-h:34rem]",
                ].join(" ")}
              >
                <aside className="order-2 min-w-0 xl:order-1 xl:h-[var(--dashboard-panel-h)]">
                  <DashboardRoutesSidebar
                    rutaActiva={rutasActivas}
                    topMorosos={topMorosos}
                  />
                </aside>

                <main className="order-1 min-w-0 xl:order-2 xl:h-[var(--dashboard-panel-h)]">
                  <div className="flex h-full min-h-0 flex-col gap-2">
                    <div className="shrink-0">
                      <DashboardKpisSection kpisData={kpisData} />
                    </div>

                    <div className="min-h-0 flex-1">
                      <DashboardTicketsActivity
                        data={ticketsActividad}
                        params={ticketsActividadParams}
                        isLoading={ticketsActividadQuery.isLoading}
                        isFetching={ticketsActividadQuery.isFetching}
                        onPresetChange={handleTicketsActividadPresetChange}
                      />
                    </div>
                  </div>
                </main>

                <aside className="order-3 min-w-0 xl:order-3 xl:h-[var(--dashboard-panel-h)]">
                  <DashboardSupportSidebar ticketsSoporte={ticketsSoporte} />
                </aside>
              </section>

              {/*
               * ============================================================
               * ACTIVIDAD DE INSTALACIONES
               * ============================================================
               *
               * Esta sección ahora usa TODO el ancho disponible.
               *
               * DashboardChartsGrid posteriormente tendrá:
               *
               * 1. Actividad del mes
               *    - barras agrupadas por día
               *
               * 2. Actividad últimos 12 meses
               *    - barras agrupadas por mes
               *
               * Las cards se colocarán una debajo de otra.
               */}
              <section
                aria-label="Actividad de instalaciones y desinstalaciones"
                className="min-w-0"
              >
                <DashboardChartsGrid
                  instalacionesMes={instalacionesMes}
                  instalacionesHistoricas={instalacionesHistoricas}
                  isMesLoading={actividadMesQuery.isLoading}
                  isHistoricoLoading={actividadHistoricaQuery.isLoading}
                />
              </section>

              {/*
               * ============================================================
               * MAPA
               * ============================================================
               *
               * Mantiene ancho completo debajo de charts.
               */}
              <section
                aria-label="Ubicación de técnicos en campo"
                className="min-w-0"
              >
                <DashboardMapPanel usuariosEnCampo={locations} />
              </section>
            </AppStack>
          </AppDataState>
        </AppStack>
      </AppContainer>
    </motion.div>
  );
}

export default NewDashboard;
