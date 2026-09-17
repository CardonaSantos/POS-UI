import { DashboardTicketsActividadParams } from "@/Crm/features/chart-types/tickets-chart";

export const DashboardQkeys = {
  all: ["dashboard-data"] as const,
  kps: ["dashboard-kpis"] as const,
  cobros: ["cobros-data"] as const,
  ticketsActividad: (params: DashboardTicketsActividadParams) =>
    [
      "dashboard",
      "tickets-actividad",
      params.preset,
      params.desde ?? null,
      params.hasta ?? null,
    ] as const,
};

export const TicketsProcesoQkeys = {
  all: ["tickets-proceso"] as const,
  specific: (ticketId: number) => ["tickets-proceso", ticketId] as const,
};

export const InstalacionesVsDesinstalacionesQkeys = {
  all: ["instalaciones-vs-desinstalaciones"] as const,
};

/**
 * Qkey para fetcheo de tickets tecnicos
 */
export const TicketsAsignadosQkeys = {
  all: ["tickets-tec-asignado"] as const,
  specific: (ticketId: number) => ["ticket-tec-asignado", ticketId] as const,
};

export const tecnicoPanelQkeys = {
  all: ["tecnico-panel"] as const,
};
