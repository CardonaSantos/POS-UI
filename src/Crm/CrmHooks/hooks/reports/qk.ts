import type {
  ReporteClientesFiltersDto,
  ReporteFacturacionFiltersDto,
  ReporteTicketsFiltersDto,
} from "@/Crm/features/reports/reportes.interfaces";

export const reportesQkeys = {
  all: ["reportes"] as const,

  catalogos: {
    all: ["reportes", "catalogos"] as const,

    servicios: ["reportes", "catalogos", "servicios"] as const,

    departamentos: ["reportes", "catalogos", "departamentos"] as const,

    municipios: (departamentoId: number | null) =>
      ["reportes", "catalogos", "municipios", departamentoId] as const,

    sectores: ["reportes", "catalogos", "sectores"] as const,

    // TICKETS

    ticketEtiquetas: ["reportes", "catalogos", "ticket-etiquetas"] as const,

    ticketTecnicos: ["reportes", "catalogos", "ticket-tecnicos"] as const,

    ticketClientes: ["reportes", "catalogos", "ticket-clientes"] as const,

    facturacionZonas: ["reportes", "catalogos", "facturacion-zonas"] as const,

    facturacionUsuarios: [
      "reportes",
      "catalogos",
      "facturacion-usuarios",
    ] as const,
  },

  clientes: (filters: ReporteClientesFiltersDto) =>
    [...reportesQkeys.all, "clientes", filters] as const,

  tickets: (filters: ReporteTicketsFiltersDto) =>
    [...reportesQkeys.all, "tickets", filters] as const,

  facturacion: (filters: ReporteFacturacionFiltersDto) =>
    [...reportesQkeys.all, "facturacion", filters] as const,
};
