export interface ReporteServicioOptionSource {
  id: number;

  nombre: string;

  velocidad: string | null;
}

// =====================================================
// TICKETS
// =====================================================

export interface ReporteTicketEtiquetaOptionSource {
  id: number;
  nombre: string;
}

export interface ReporteTicketTecnicoOptionSource {
  id: number;
  nombre: string;
}

export interface ReporteTicketClienteOptionSource {
  id: number;
  nombre: string;
}

export interface ReporteDepartamentoOptionSource {
  id: number;

  nombre: string;
}

export interface ReporteMunicipioOptionSource {
  id: number;

  nombre: string;

  departamentoId: number;
}

export interface ReporteSectorOptionSource {
  id: number;

  nombre: string;

  descripcion?: string | null;

  municipioId: number;
}

// =====================================================
// FACTURACIÓN
// =====================================================

export interface ReporteFacturacionZonaOptionSource {
  id: number;
  nombre: string;
  clientesCount: number;
  facturasCount: number;
}

export interface ReporteFacturacionUsuarioOptionSource {
  id: number;
  nombre: string;
  rol: string;
}
