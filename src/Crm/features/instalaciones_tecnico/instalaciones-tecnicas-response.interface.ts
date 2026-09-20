import {
  AccionInstalacionAcceso,
  BandaWifi,
  EstadoAccesoInternet,
  EstadoCuentaPppoe,
  EstadoInstalacionCliente,
  MetodoAutenticacionInternet,
  RolTecnicoOperacionCliente,
  TecnologiaAccesoInternet,
  TipoEvidenciaClienteOperacion,
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

// DETALLE TECNICO OPERATIVOS
export interface InstalacionTecnicaDetalleAgenda {
  creadoEn: string;
  actualizadoEn: string;

  programadaPara: string | null;
  inicioReal: string | null;
  finalizacionReal: string | null;
  cancelacion: string | null;
  activacionServicio: string | null;
}

export interface InstalacionTecnicaDetalleTrabajo {
  descripcion: string | null;
  motivo: string | null;
  observaciones: string | null;
  resultado: string | null;
}

export interface InstalacionTecnicaDetalleCliente {
  id: number;
  nombreCompleto: string;
  telefono: string | null;
  telefonoReferencia: string | null;
  dpi: string | null;
  direccion: string | null;

  observaciones: string | null;

  municipio: string | null;
  departamento: string | null;

  sector: string | null;
}

export interface InstalacionTecnicaDetalleCobro {
  costoInstalacion: number;
  costoMateriales: number;
  costoManoObra: number;
  costoOtros: number;
  montoCobradoCliente: number;
  pendienteCobrar: number;
  notas: string | null;
}
export interface InstalacionTecnicaParticipante {
  asignacionId: number;
  tecnicoId: number | null;

  nombre: string;
  avatarUrl: string | null;

  rol: RolTecnicoOperacionCliente;
  esResponsable: boolean;

  tiempoMinutos: number | null;
  observaciones: string | null;
}
export interface InstalacionTecnicaConfiguracionAcceso {
  id: number;

  potenciaOpticaRxDbm: number | null;
  senalInalambricaDbm: number | null;

  ssid: string | null;
  tieneContrasenaWifi: boolean;

  bandaWifi: BandaWifi | null;
  canal: number | null;
  anchoCanalMhz: number | null;

  ipv4: string | null;
  ipv6: string | null;

  gateway: string | null;
  dnsPrimario: string | null;
  dnsSecundario: string | null;

  observaciones: string | null;
}
export interface InstalacionTecnicaCuentaPppoe {
  id: number;
  usuario: string;

  estado: EstadoCuentaPppoe;

  perfilHomologacionId: number;
  codigoPerfil: string;

  mikrotikRouterId: number;
  routerNombre: string;

  generadoEn: string;
  activadoEn: string | null;
  ultimaSincronizacionEn: string | null;

  ultimoError: string | null;
}
export interface InstalacionTecnicaAcceso {
  vinculoId: number;

  accion: AccionInstalacionAcceso;

  accesoInternetId: number;

  tecnologia: TecnologiaAccesoInternet;
  metodoAutenticacion: MetodoAutenticacionInternet;
  estado: EstadoAccesoInternet;

  servicioInternetId: number | null;

  configuracionTecnica: InstalacionTecnicaConfiguracionAcceso | null;

  cuentaPppoe: InstalacionTecnicaCuentaPppoe | null;
}
export interface InstalacionTecnicaEvidencia {
  evidenciaId: number;
  mediaId: number;

  tipo: TipoEvidenciaClienteOperacion;

  descripcion: string | null;
  orden: number;

  url: string | null;
  mimeType: string | null;
  titulo: string | null;

  creadoEn: string;
}
export interface InstalacionTecnicaEquipo {
  id: number;

  productoId: number | null;
  productoNombre: string | null;

  serialProductoId: number | null;
  serial: string | null;

  descripcion: string | null;

  cantidad: number;
  esPrincipal: boolean;

  notas: string | null;
}
export interface InstalacionTecnicaAccion {
  habilitada: boolean;
  motivo: string | null;
}

export interface InstalacionTecnicaAcciones {
  reprogramar: InstalacionTecnicaAccion;
  iniciar: InstalacionTecnicaAccion;
  completar: InstalacionTecnicaAccion;
  cancelar: InstalacionTecnicaAccion;
  subirEvidencia: InstalacionTecnicaAccion;
  revelarCredenciales: InstalacionTecnicaAccion;
  reintentarPrealta: InstalacionTecnicaAccion;
}

//  firma detalle
export interface DetalleInstalacionTecnicaResponse {
  id: number;
  empresaId: number;

  tipo: TipoInstalacionCliente;
  estado: EstadoInstalacionCliente;

  agenda: InstalacionTecnicaDetalleAgenda;

  trabajo: InstalacionTecnicaDetalleTrabajo;

  cliente: InstalacionTecnicaDetalleCliente;

  ubicacion: InstalacionTecnicaUbicacion;

  servicioInternet: InstalacionTecnicaServicioInternet | null;

  cobro: InstalacionTecnicaDetalleCobro;

  miAsignacion: InstalacionTecnicaMiAsignacion | null;

  participantes: InstalacionTecnicaParticipante[];

  accesos: InstalacionTecnicaAcceso[];

  evidencias: InstalacionTecnicaEvidencia[];

  equipos: InstalacionTecnicaEquipo[];

  acciones: InstalacionTecnicaAcciones;
}
