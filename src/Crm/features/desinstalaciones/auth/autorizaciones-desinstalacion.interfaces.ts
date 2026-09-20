import type { PaginationMeta } from "@/Crm/features/instalaciones/instalaciones.interfaces";
import {
  EstadoAutorizacionDesinstalacion,
  EstadoDesinstalacionCliente,
  MotivoDesinstalacionCliente,
  TipoDesinstalacionCliente,
} from "../desinstalaciones.enums";

export interface AutorizacionDesinstalacionResumen {
  id: number;

  desinstalacionId: number;

  solicitadoPorId: number | null;

  autorizadoPorId: number | null;

  estado: EstadoAutorizacionDesinstalacion;

  motivoSolicitud: string | null;

  comentarioAutorizador: string | null;

  fechaSolicitud: string;

  fechaRespuesta: string | null;
}

export interface AutorizacionPendienteSolicitante {
  id: number;

  nombre: string;
}

export interface AutorizacionPendienteCliente {
  id: number;

  nombre: string;

  apellidos: string | null;

  telefono: string | null;

  direccion: string | null;
}

export interface AutorizacionPendienteServicio {
  id: number;

  nombre: string;

  velocidad: string | null;

  precio: number;
}

export interface AutorizacionPendienteDesinstalacion {
  id: number;

  clienteId: number;

  servicioInternetId: number | null;

  tipo: TipoDesinstalacionCliente;

  motivo: MotivoDesinstalacionCliente | null;

  estado: EstadoDesinstalacionCliente;

  fechaProgramada: string | null;

  observaciones: string | null;

  cliente: AutorizacionPendienteCliente;

  servicioInternet: AutorizacionPendienteServicio | null;
}

export interface AutorizacionPendienteListItem {
  autorizacion: AutorizacionDesinstalacionResumen;

  solicitadoPor: AutorizacionPendienteSolicitante | null;

  desinstalacion: AutorizacionPendienteDesinstalacion;
}

export interface AutorizacionesPendientesResponse {
  data: AutorizacionPendienteListItem[];

  meta: PaginationMeta;
}

export interface AutorizacionesPendientesQueryParams {
  page: number;

  limit: number;
}

/**
 * DTO exacto de PATCH /autorizaciones/:id/aprobar
 */
export interface AprobarAutorizacionDesinstalacionPayload {
  contrasenaActual: string;

  comentarioAutorizador?: string;
}

/**
 * DTO exacto de PATCH /autorizaciones/:id/rechazar
 */
export interface RechazarAutorizacionDesinstalacionPayload {
  comentarioAutorizador?: string;
}

export interface AutorizacionDecisionResponse {
  autorizacion: AutorizacionDesinstalacionResumen;

  desinstalacion: {
    id: number;

    estado: EstadoDesinstalacionCliente;

    accesoInternetId: number | null;
  };
}
