import {
  DashboardCobrosResponse,
  DashboardData,
} from "@/Crm/features/dashboard/dashboard.interfaces";
import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import {
  DashboardQkeys,
  InstalacionesVsDesinstalacionesQkeys,
  TicketsAsignadosQkeys,
  TicketsProcesoQkeys,
} from "./Qk";
import { ChartDataLineNivo } from "@/Crm/_charts/line-chart/LineChart.interfaces";
import { NivoBarData } from "@/Crm/_charts/bar-chart/bar-chart.interface";
import { TicketsDashboardSoporte } from "@/Crm/CrmNewDashboard/interfaces/dashboard-interfaces";
import { TicketAsignadoTecnico } from "@/Crm/features/dashboard/dashboard-tickets";
import { useQueryClient } from "@tanstack/react-query";

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
    }
  );
}

/**
 * INSTALACIONES VS DESINSTALACIONES LINE CHART
 * @returns
 */
export function useGetDashboardChartInstalaciones() {
  return useCrmQuery<ChartDataLineNivo>(
    DashboardQkeys.all,
    `dashboard/instalaciones-vs-desinstalaciones`,
    undefined,
    {
      initialData: [],
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
  );
}

/**
 * INSTALACIONES HISTORICAS BAR CHART
 * @returns
 */
export function useGetInstalacionesVsDesinstalaciones() {
  return useCrmQuery<NivoBarData>(
    InstalacionesVsDesinstalacionesQkeys.all,
    `dashboard/instalaciones-historicas`,
    undefined,
    {
      initialData: [],
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
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
    }
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
    }
  );
}

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
      staleTime: 0,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    }
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
    }
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
    }
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
    }
  );
}
