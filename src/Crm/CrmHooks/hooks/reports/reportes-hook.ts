import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";

import { reportesQkeys } from "./qk";

import type {
  ReporteClientesFiltersDto,
  ReporteFacturacionFiltersDto,
  ReporteTicketsFiltersDto,
} from "@/Crm/features/reports/reportes.interfaces";

const REPORT_XLSX_QUERY_OPTIONS = {
  enabled: false,
  retry: false,
  staleTime: 0,
} as const;

// CLIENTES

export function useGetReporteClientesXlsx(filters: ReporteClientesFiltersDto) {
  return crm.useQueryApi<Blob>(
    reportesQkeys.clientes(filters),

    crm_endpoints.reportes.get_clientes_xlsx,

    {
      params: filters,
      responseType: "blob",
    },

    REPORT_XLSX_QUERY_OPTIONS,
  );
}

// TICKETS

export function useGetReporteTicketsXlsx(filters: ReporteTicketsFiltersDto) {
  return crm.useQueryApi<Blob>(
    reportesQkeys.tickets(filters),

    crm_endpoints.reportes.get_tickets_xlsx,

    {
      params: filters,
      responseType: "blob",
    },

    REPORT_XLSX_QUERY_OPTIONS,
  );
}

// FACTURACIÓN

export function useGetReporteFacturacionXlsx(
  filters: ReporteFacturacionFiltersDto,
) {
  return crm.useQueryApi<Blob>(
    reportesQkeys.facturacion(filters),

    crm_endpoints.reportes.get_facturacion_xlsx,

    {
      params: filters,
      responseType: "blob",
    },

    REPORT_XLSX_QUERY_OPTIONS,
  );
}
