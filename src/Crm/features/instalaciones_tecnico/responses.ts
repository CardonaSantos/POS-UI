import {
  EstadoInstalacionCliente,
  RolTecnicoOperacionCliente,
  TipoInstalacionCliente,
} from "../instalaciones/enums";
import { PaginationMeta } from "../instalaciones/instalaciones.interfaces";

export interface InstalacionTecnicaAsignadaAgenda {
  creadoEn: string;
  programadaPara: string | null;
  inicioReal: string | null;
  finalizacionReal: string | null;
}

export interface InstalacionTecnicaAsignadaCliente {
  id: number;
  nombreCompleto: string;
  telefono: string | null;
  direccion: string | null;
}

export interface InstalacionTecnicaUbicacion {
  direccion: string | null;
  referencia: string | null;
  latitud: number | null;
  longitud: number | null;
}

export interface InstalacionTecnicaServicioInternet {
  id: number;
  nombre: string;
  velocidad: string | null;
  precio: number | null;
}

export interface InstalacionTecnicaCobroResumen {
  costoInstalacion: number;
  montoCobradoCliente: number;
  pendienteCobrar: number;
}

export interface InstalacionTecnicaMiAsignacion {
  asignacionId: number;
  tecnicoId: number | null;
  rol: RolTecnicoOperacionCliente;
  esResponsable: boolean;
}

export interface InstalacionTecnicaResponsable {
  asignacionId: number;
  tecnicoId: number | null;
  nombre: string;
  avatarUrl: string | null;
}

export interface InstalacionTecnicaConteos {
  tecnicos: number;
  evidencias: number;
  equipos: number;
}

export interface InstalacionTecnicaAsignada {
  id: number;
  empresaId: number;

  tipo: TipoInstalacionCliente;
  estado: EstadoInstalacionCliente;

  agenda: InstalacionTecnicaAsignadaAgenda;

  cliente: InstalacionTecnicaAsignadaCliente;

  ubicacion: InstalacionTecnicaUbicacion;

  servicioInternet: InstalacionTecnicaServicioInternet | null;

  cobro: InstalacionTecnicaCobroResumen;

  miAsignacion: InstalacionTecnicaMiAsignacion;

  tecnicoResponsable: InstalacionTecnicaResponsable | null;

  conteos: InstalacionTecnicaConteos;
}

export interface ListarInstalacionesTecnicasAsignadasResponse {
  data: InstalacionTecnicaAsignada[];
  meta: PaginationMeta;
}
