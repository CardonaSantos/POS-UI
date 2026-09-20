import { crm } from "@/Crm/API/crmApi";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";

import type {
  ReporteDepartamentoOptionSource,
  ReporteFacturacionUsuarioOptionSource,
  ReporteFacturacionZonaOptionSource,
  ReporteMunicipioOptionSource,
  ReporteSectorOptionSource,
  ReporteServicioOptionSource,
  ReporteTicketClienteOptionSource,
  ReporteTicketEtiquetaOptionSource,
  ReporteTicketTecnicoOptionSource,
} from "@/Crm/features/reports/reportes-catalogos.interfaces";

import { reportesQkeys } from "./qk";

// SERVICIOS

export function useGetReporteServicios() {
  return crm.useQueryApi<ReporteServicioOptionSource[]>(
    reportesQkeys.catalogos.servicios,

    crm_endpoints.reportes_catalogos.get_servicios,

    undefined,

    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
}

// DEPARTAMENTOS

export function useGetReporteDepartamentos() {
  return crm.useQueryApi<ReporteDepartamentoOptionSource[]>(
    reportesQkeys.catalogos.departamentos,

    crm_endpoints.reportes_catalogos.get_departamentos,

    undefined,

    {
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
}

// MUNICIPIOS

export function useGetReporteMunicipios(departamentoId: number | null) {
  const enabled =
    Number.isInteger(departamentoId) && Number(departamentoId) > 0;

  return crm.useQueryApi<ReporteMunicipioOptionSource[]>(
    reportesQkeys.catalogos.municipios(departamentoId),

    crm_endpoints.reportes_catalogos.get_municipios_departamento(
      departamentoId ?? 0,
    ),

    undefined,

    {
      enabled,
      staleTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
}

// SECTORES

export function useGetReporteSectores() {
  return crm.useQueryApi<ReporteSectorOptionSource[]>(
    reportesQkeys.catalogos.sectores,

    crm_endpoints.reportes_catalogos.get_sectores,

    undefined,

    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
}

// TICKETS

// TICKET - ETIQUETAS

export function useGetReporteTicketEtiquetas() {
  return crm.useQueryApi<ReporteTicketEtiquetaOptionSource[]>(
    reportesQkeys.catalogos.ticketEtiquetas,

    crm_endpoints.reportes_catalogos.get_ticket_etiquetas,

    undefined,

    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
}

// TICKET - TÉCNICOS

export function useGetReporteTicketTecnicos() {
  return crm.useQueryApi<ReporteTicketTecnicoOptionSource[]>(
    reportesQkeys.catalogos.ticketTecnicos,

    crm_endpoints.reportes_catalogos.get_ticket_tecnicos,

    undefined,

    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
}

// TICKET - CLIENTES

export function useGetReporteTicketClientes() {
  return crm.useQueryApi<ReporteTicketClienteOptionSource[]>(
    reportesQkeys.catalogos.ticketClientes,

    crm_endpoints.reportes_catalogos.get_ticket_clientes,

    undefined,

    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
}

// FACTURACIÓN - ZONAS

export function useGetReporteFacturacionZonas() {
  return crm.useQueryApi<ReporteFacturacionZonaOptionSource[]>(
    reportesQkeys.catalogos.facturacionZonas,

    crm_endpoints.reportes_catalogos.get_facturacion_zonas,

    undefined,

    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
}

// FACTURACIÓN - USUARIOS

export function useGetReporteFacturacionUsuarios() {
  return crm.useQueryApi<ReporteFacturacionUsuarioOptionSource[]>(
    reportesQkeys.catalogos.facturacionUsuarios,

    crm_endpoints.reportes_catalogos.get_facturacion_usuarios,

    undefined,

    {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  );
}
