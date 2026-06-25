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
  useGetDashboardChartInstalaciones,
  useGetDashboardData,
  useGetInstalacionesVsDesinstalaciones,
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

import type { DashboardCobrosResponse } from "../features/dashboard/dashboard.interfaces";

import type { RealTimeLocationRaw } from "../features/real-time-location/real-time-location";
import type { TicketsDashboardSoporte } from "./interfaces/dashboard-interfaces";
import { DashboardRuntimeBar } from "./_components/dashboard-runtime-bar";
import { DashboardKpisSection } from "./_components/DashboardKpisSection";
import { DashboardMapPanel } from "./_components/dashboard-charts-grids";

const EMPTY_COBROS_DATA: DashboardCobrosResponse = {
  rutasActiva: [],
  morosoTop: [],
};
const DEFAULT_DASHBOARD_DATA = {
  clientes: {
    totalEnSistema: 0,
    activos: 0,
    suspendidos: 0,
    desinstalados: 0,
    pendientesActivacion: 0,
    morosos: 0,
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

  const instalacionesMesQuery = useGetDashboardChartInstalaciones();
  const instalacionesHistoricasQuery = useGetInstalacionesVsDesinstalaciones();
  const kpisQuery = useGetDashboardData();
  const ticketsQuery = useGetTicketProceso();
  const cobrosQuery = useGetCobrosDashboard();
  const locationsQuery = useGetUsersRealTime();

  const instalacionesMes = instalacionesMesQuery.data ?? [];
  const instalacionesHistoricas = instalacionesHistoricasQuery.data ?? [];
  const ticketsSoporte = ticketsQuery.data ?? EMPTY_TICKETS_SOPORTE;
  const cobros = cobrosQuery.data ?? EMPTY_COBROS_DATA;
  const kpisData = kpisQuery.data ?? DEFAULT_DASHBOARD_DATA;
  const locations = React.useMemo<RealTimeLocationRaw[]>(() => {
    return Array.isArray(locationsQuery.data) ? locationsQuery.data : [];
  }, [locationsQuery.data]);

  const rutasActivas = Array.isArray(cobros.rutasActiva)
    ? cobros.rutasActiva
    : [];

  const topMorosos = Array.isArray(cobros.morosoTop) ? cobros.morosoTop : [];

  const ticketsEnProceso = Array.isArray(ticketsSoporte.tickets)
    ? ticketsSoporte.tickets.length
    : 0;

  const tecnicosEnLinea = ticketsSoporte.ticketsMetricas?.enLinea ?? 0;

  const isCoreLoading =
    kpisQuery.isLoading || ticketsQuery.isLoading || cobrosQuery.isLoading;

  const isRefreshing =
    kpisQuery.isFetching ||
    ticketsQuery.isFetching ||
    cobrosQuery.isFetching ||
    instalacionesMesQuery.isFetching ||
    instalacionesHistoricasQuery.isFetching ||
    locationsQuery.isFetching;

  const hasCoreData = Boolean(
    kpisQuery.data || ticketsQuery.data || cobrosQuery.data,
  );

  const dashboardError =
    kpisQuery.error ??
    ticketsQuery.error ??
    cobrosQuery.error ??
    instalacionesMesQuery.error ??
    instalacionesHistoricasQuery.error ??
    locationsQuery.error ??
    null;

  const hasSoftError = Boolean(
    kpisQuery.isError ||
    ticketsQuery.isError ||
    cobrosQuery.isError ||
    instalacionesMesQuery.isError ||
    instalacionesHistoricasQuery.isError ||
    locationsQuery.isError,
  );

  const showGlobalLoading = isCoreLoading && !hasCoreData;
  const showGlobalError = Boolean(dashboardError && !hasCoreData);

  const refetchAll = React.useCallback(async () => {
    await Promise.allSettled([
      kpisQuery.refetch(),
      ticketsQuery.refetch(),
      cobrosQuery.refetch(),
      instalacionesMesQuery.refetch(),
      instalacionesHistoricasQuery.refetch(),
      locationsQuery.refetch(),
    ]);
  }, [
    kpisQuery,
    ticketsQuery,
    cobrosQuery,
    instalacionesMesQuery,
    instalacionesHistoricasQuery,
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

          if (!oldData) return [incoming];

          const exists = oldData.some(
            (location) => location.usuarioId === incoming.usuarioId,
          );

          if (!exists) return [...oldData, incoming];

          return oldData.map((location) =>
            location.usuarioId === incoming.usuarioId ? incoming : location,
          );
        },
      );
    },
    [queryClient],
  );

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
          <DashboardRuntimeBar
            isRefreshing={isRefreshing}
            rutasCount={rutasActivas.length}
            morososCount={topMorosos.length}
            tecnicosEnLinea={tecnicosEnLinea}
            ticketsEnProceso={ticketsEnProceso}
            usuariosEnCampo={locations.length}
            onRefresh={() => void refetchAll()}
          />

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
            error={showGlobalError ? dashboardError : null}
            isEmpty={false}
            onRetry={() => void refetchAll()}
            loadingVariant="skeleton-grid"
            loadingRows={6}
          >
            <AppStack gap="xs" className="min-w-0">
              <section
                aria-label="Dashboard operativo"
                className={[
                  "grid min-w-0 grid-cols-1 gap-2",
                  "xl:grid-cols-[15.5rem_minmax(0,1fr)_16rem]",
                  "2xl:grid-cols-[17rem_minmax(0,1fr)_17rem]",
                ].join(" ")}
              >
                {/* Columna izquierda */}
                <aside className="order-2 min-w-0 xl:order-1">
                  <DashboardRoutesSidebar
                    rutaActiva={rutasActivas}
                    topMorosos={topMorosos}
                  />
                </aside>

                {/* Centro: KPIs + charts */}
                <main className="order-1 min-w-0 xl:order-2">
                  <AppStack gap="xs" className="min-w-0">
                    <DashboardKpisSection kpisData={kpisData} />

                    <DashboardChartsGrid
                      instalacionesMes={instalacionesMes}
                      instalacionesHistoricas={instalacionesHistoricas}
                    />
                  </AppStack>
                </main>

                {/* Columna derecha */}
                <aside className="order-3 min-w-0 xl:order-3 ">
                  <DashboardSupportSidebar ticketsSoporte={ticketsSoporte} />
                </aside>
              </section>

              {/* Mapa abajo en ancho completo */}
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
