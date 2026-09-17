import {
  DashboardCobrosResponse,
  DashboardData,
} from "@/Crm/features/dashboard/dashboard.interfaces";
import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import {
  DashboardQkeys,
  InstalacionesVsDesinstalacionesQkeys,
  tecnicoPanelQkeys,
  TicketsAsignadosQkeys,
  TicketsProcesoQkeys,
} from "./Qk";
import { TicketsDashboardSoporte } from "@/Crm/CrmNewDashboard/interfaces/dashboard-interfaces";
import { TicketAsignadoTecnico } from "@/Crm/features/dashboard/dashboard-tickets";
import { useQueryClient } from "@tanstack/react-query";
import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { TecnicoPanelResponse } from "@/Crm/features/dashboard/panel-tecnico.types";
import {
  DashboardActividadHistorica,
  DashboardActividadMes,
} from "@/Crm/features/chart-types/chart-interfaces";
import {
  DashboardTicketsActividad,
  DashboardTicketsActividadParams,
} from "@/Crm/features/chart-types/tickets-chart";

/**
 * DATOS KPI
 * @returns
 */
export function useGetDashboardData() {
  return useCrmQuery<DashboardData>(
    DashboardQkeys.kps,
    `dashboard/get-new-dashboard-data`,
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

/**
 * ACTIVIDAD DE INSTALACIONES Y DESINSTALACIONES DEL MES
 */
export function useGetDashboardActividadMes() {
  return useCrmQuery<DashboardActividadMes>(
    DashboardQkeys.all,
    `dashboard/instalaciones-vs-desinstalaciones`,
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

/**
 * ACTIVIDAD HISTÓRICA DE INSTALACIONES Y DESINSTALACIONES
 * Últimos 12 meses
 */
export function useGetDashboardActividadHistorica() {
  return useCrmQuery<DashboardActividadHistorica>(
    InstalacionesVsDesinstalacionesQkeys.all,
    `dashboard/instalaciones-historicas`,
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

/**
 * TICKETS EN PROCESO
 * @returns
 */
export function useGetTicketProceso() {
  return useCrmQuery<TicketsDashboardSoporte>(
    TicketsProcesoQkeys.all,
    `dashboard/tickets-proceso`,
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

/**
 * COBRO
 * @returns
 */
export function useGetCobrosDashboard() {
  return useCrmQuery<DashboardCobrosResponse>(
    DashboardQkeys.cobros,
    `dashboard/cobros`,
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

// TECNICOS
// TECNICOS
/**
 * Hook de retorno de tickets tecnico
 * @param tecId
 * @returns
 */
export function useGetTicketsAsignados(tecId: number) {
  return useCrmQuery<TicketAsignadoTecnico[]>(
    TicketsAsignadosQkeys.all,
    `dashboard/get-tickets-asignados/${tecId}`,
    undefined,
    {
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
      enabled: tecId > 0,
    },
  );
}

/**
 * Hook de retorno de tickets tecnico
 * @param tecId
 * @returns
 */
export function useGetTicketDetails(ticketId: number) {
  return useCrmQuery<TicketAsignadoTecnico>(
    TicketsAsignadosQkeys.specific(ticketId),
    `dashboard/get-ticket-asignado-details/${ticketId}`,
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

/**
 * PONER EN PROCESO UN TICKET
 */
export function usePatchTicketEnProceso(ticketId: number) {
  const queryClient = useQueryClient();

  return useCrmMutation<void, void>(
    "patch",
    `tickets-soporte/update-ticket-proceso/${ticketId}`,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: TicketsAsignadosQkeys.specific(ticketId),
        });
        queryClient.invalidateQueries({
          queryKey: TicketsAsignadosQkeys.all,
        });
      },
    },
  );
}

/**
 * PONER EN REVISIÓN UN TICKET
 */
export function usePatchTicketEnRevision(ticketId: number) {
  const queryClient = useQueryClient();

  return useCrmMutation<void, void>(
    "patch",
    `tickets-soporte/update-ticket-revision/${ticketId}`,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: TicketsAsignadosQkeys.specific(ticketId),
        });
        queryClient.invalidateQueries({
          queryKey: TicketsAsignadosQkeys.all,
        });
      },
    },
  );
}

/**
 * CONSEGUIR DATOS PARA UN PANEL DE TECNICO
 * - no ocupa id del tecnico, el mismo envia el token por su cuenta
 * y se dereiva ahi
 */
/**
 *
 * @param
 * @returns
 */
export function useGetTecnicoPanel() {
  return crm.useQueryApi<TecnicoPanelResponse>(
    tecnicoPanelQkeys.all,
    crm_endpoints.dashboard.tecnico_panel,
  );
}

/**
 * ACTIVIDAD DE SOPORTE
 *
 * Presets soportados:
 * - 7D
 * - 30D
 * - 12M
 * - HISTORICO
 * - CUSTOM
 */
export function useGetDashboardTicketsActividad(
  params: DashboardTicketsActividadParams = {
    preset: "7D",
  },
) {
  const searchParams = new URLSearchParams();

  searchParams.set("preset", params.preset);

  /**
   * Las fechas solamente tienen sentido
   * para un rango personalizado.
   */
  if (params.preset === "CUSTOM") {
    if (params.desde) {
      searchParams.set("desde", params.desde);
    }

    if (params.hasta) {
      searchParams.set("hasta", params.hasta);
    }
  }

  const endpoint = `dashboard/tickets-actividad?${searchParams.toString()}`;

  const customRangeReady =
    params.preset !== "CUSTOM" || Boolean(params.desde && params.hasta);

  return useCrmQuery<DashboardTicketsActividad>(
    DashboardQkeys.ticketsActividad(params),
    endpoint,
    undefined,
    {
      /**
       * No ejecutamos CUSTOM hasta tener
       * ambas fechas.
       */
      enabled: customRangeReady,

      staleTime: 0,

      gcTime: 1000 * 60 * 5,

      refetchOnWindowFocus: "always",

      refetchOnMount: "always",

      refetchOnReconnect: "always",

      retry: 1,
    },
  );
}
