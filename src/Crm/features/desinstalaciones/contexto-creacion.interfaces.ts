import type {
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
  MetodoAutenticacionInternet,
  TecnologiaAccesoInternet,
} from "@/Crm/features/instalaciones/enums";

/**
 * ============================================================
 * CLIENTE
 * ============================================================
 */

export interface ContextoDesinstalacionCliente {
  id: number;

  nombre: string;

  apellidos: string | null;

  telefono: string | null;

  dpi: string | null;

  direccion: string | null;
}

/**
 * ============================================================
 * SERVICIO DE INTERNET
 * ============================================================
 */

export interface ContextoDesinstalacionServicioInternet {
  id: number;

  nombre: string;

  velocidad: string | null;

  precio: number;
}

/**
 * ============================================================
 * CUENTA PPPoE
 * ============================================================
 */

export interface ContextoDesinstalacionCuentaPppoe {
  id: number;

  usuario: string;

  estado: EstadoCuentaPppoe;

  perfilHomologacionId: number;
}

/**
 * ============================================================
 * ACCESO DE INTERNET
 * ============================================================
 */

export interface ContextoDesinstalacionAcceso {
  id: number;

  servicioInternetId: number | null;

  tecnologia: TecnologiaAccesoInternet;

  metodoAutenticacion: MetodoAutenticacionInternet;

  estado: EstadoAccesoInternet;

  activadoEn: string | null;

  suspendidoEn: string | null;

  dadoDeBajaEn: string | null;

  servicioInternet: ContextoDesinstalacionServicioInternet | null;

  cuentaPppoe: ContextoDesinstalacionCuentaPppoe | null;
}

/**
 * ============================================================
 * TICKET
 * ============================================================
 *
 * Estos dos tipos deben coincidir con los enums que ya utiliza
 * el módulo de soporte.
 *
 * Si actualmente no tienes exportados EstadoTicketSoporte /
 * PrioridadTicketSoporte en frontend, podemos tiparlos desde
 * el módulo de tickets en el siguiente ajuste.
 * ============================================================
 */

export interface ContextoDesinstalacionTicket {
  id: number;

  titulo: string | null;

  descripcion: string | null;

  estado: string;

  prioridad: string;

  fechaApertura: string;

  fechaCierre: string | null;
}

/**
 * ============================================================
 * RESPONSE
 * ============================================================
 */

export interface ContextoCreacionDesinstalacionResponse {
  cliente: ContextoDesinstalacionCliente;

  accesos: ContextoDesinstalacionAcceso[];

  tickets: ContextoDesinstalacionTicket[];
}
