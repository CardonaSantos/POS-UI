import { CustomerImage } from "../customer-galery/customer-galery.interfaces";
// import { Departamentos } from "../locations-interfaces/municipios_departamentos.interfaces";
import { MikrotikRoutersResponse } from "../mikro-tiks/mikrotiks.interfaces";
import { RolUsuario } from "../users/users-rol";
// import { NuevaFacturacionZona } from "../zonas-facturacion/FacturacionZonaTypes";

export interface ClienteDetailsDto {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string | null;
  direccion: string | null;
  dpi: string | null;
  observaciones: string | null;
  contactoReferenciaNombre: string | null;
  contactoReferenciaTelefono: string | null;

  estadoCliente: EstadoCliente;
  estadoCobranza: EstadoCobranzaCliente;

  estadoServicioMikrotik: EstadoServicioMikrotik;
  servicioEstado: boolean;

  contrasenaWifi: string | null;
  ssidRouter: string | null;
  fechaInstalacion: string | null;

  imagenes: CustomerImage[];

  asesor: Asesor | null;
  servicio: ServicioInternetResumen | null;
  municipio: MunicipioResumen | null;
  departamento: DepartamentoResumen | null;
  sector: SectorResumen | null;
  empresa: EmpresaResumen | null;

  IP: IP | null;
  ubicacion: Ubicacion | null;
  mikrotik: MikrotikRoutersResponse | null;

  facturacionZona: FacturacionZonaResumen | null;
  contratoServicioInternet: ContratoServicioInternet | null;
  saldoCliente: SaldoCliente | null;

  creadoEn: string;
  actualizadoEn: string;

  ticketSoporte: TicketSoporte[];
  facturaInternet: FacturaInternet[];
  clienteServicio: ClienteServicio[];
}

// PARTES DE CLIENTE DETAILS
interface FacturacionZonaResumen {
  id: number;
  nombre: string;
  creadoEn: string;
  actualizadoEn: string;
  enviarRecordatorio: boolean;
  diaPago: number | null;
  diaGeneracionFactura: number | null;
  diaCorte: number | null;
}

interface MunicipioResumen {
  id: number;
  nombre: string;
}

interface DepartamentoResumen {
  id: number;
  nombre: string;
}

interface SectorResumen {
  id: number;
  nombre: string;
}

interface EmpresaResumen {
  id: number;
  nombre: string;
}

interface ServicioInternetResumen {
  id: number;
  nombre: string;
  precio: number;
  velocidad: string;
}
// PARTES DE CLIENTE DETAILS

export enum EstadoServicioMikrotik {
  SIN_MIKROTIK = "SIN_MIKROTIK",
  ACTIVO = "ACTIVO",
  SUSPENDIDO = "SUSPENDIDO",
  PENDIENTE_APLICAR = "PENDIENTE_APLICAR",
  ERROR = "ERROR",
}

// Servicios de Internet
export interface ServiciosInternet {
  id: number;
  nombre: string;
  velocidad: string;
}

export enum EstadoCliente {
  ACTIVO = "ACTIVO", // Pago al día
  PENDIENTE_ACTIVO = "PENDIENTE_ACTIVO", // Tiene un recibo pendiente
  PAGO_PENDIENTE = "PAGO_PENDIENTE", // Tiene un pago pendiente vencido
  MOROSO = "MOROSO", // Más de 3 meses sin pagar y cortado
  ATRASADO = "ATRASADO", // Dos facturas
  SUSPENDIDO = "SUSPENDIDO", // Servicio cortado
  DESINSTALADO = "DESINSTALADO", // Desintalado
  EN_INSTALACION = "EN_INSTALACION",
}

export enum EstadoCobranzaCliente {
  AL_DIA = "AL_DIA",
  PAGO_PENDIENTE = "PAGO_PENDIENTE",
  ATRASADO = "ATRASADO",
  MOROSO = "MOROSO",
}

// ======================================================
// CONTRATO SERVICIO INTERNET
// ======================================================
export interface ContratoServicioInternet {
  id: number;
  creadoEn: string;
  actualizadoEn: string;
  costoInstalacion: number;
  fechaInstalacionProgramada: string;
  fechaPago: string;
  ssid: string;
  wifiPassword: string;
}

// ======================================================
// CATALOGOS BÁSICOS: Sector, Asesor, Servicio, Municipio, Departamento
// ======================================================
export interface Sector {
  id: number;
  nombre: string;
  descripcion: string | null;
  municipioId: number;
  municipio?: Municipio;
  clientes?: ClienteDetailsDto[];
  creadoEn: string | Date;
  actualizadoEn: string | Date;
  clientesCount?: number;
}

export interface Asesor {
  id: number;
  nombre: string;
}

// ⚠️ PRIMERA definición de Servicio
export interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  velocidad: string;
}

export interface Municipio {
  id: number;
  nombre: string;
}

// ======================================================
// EMPRESA (PRIMERA definición simple)
// ======================================================
export interface Empresa {
  id: number;
  nombre: string;
}

// ======================================================
// INFO TECNICA: IP, Ubicación
// ======================================================
export interface IP {
  id: number;
  direccion: string;
  mascara: string;
  gateway: string;
}

export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

// ======================================================
// SALDO CLIENTE
// ======================================================
export interface SaldoCliente {
  id: number;
  saldo: number;
  saldoPendiente: number;
  totalPagos: number;
  ultimoPago: string;
}

// ======================================================
// TICKETS DE SOPORTE
// ======================================================
export interface TicketSoporte {
  id: number;
  titulo: string;
  descripcion: string | null;
  estado: string;
  prioridad: string;
  fechaCreacion: string;
  fechaApertura: string;
  fechaCierre: string | null;
  fechaInicioAtencion: string | null;
  fechaResolucionTecnico: string | null;

  resumen: TicketResumen | null;
  etiquetas: TicketEtiqueta[];

  /**
   * El backend actual retorna "creadoPro", no "creadoPor".
   */
  creadoPro: UsuarioResumen | null;

  tecnico: UsuarioResumen | null;
  acompanantes: UsuarioResumen[];
  seguimientos: TicketSeguimiento[];
}

export interface TicketSeguimiento {
  id: number;
  descripcion: string;
  creadoEn: string;

  usuario: {
    id: number;
    nombre: string;
    rol: RolUsuario;
  };
}

interface TicketResumen {
  id: number;
  tiempoTecnicoMinutos: number | null;
  tiempoTotalMinutos: number | null;
  resueltoComo: string | null;
  reabierto: boolean;
  numeroReaperturas: number;
  notasInternas: string | null;
  creadoEn: string;
}

interface TicketEtiqueta {
  id: number;
  nombre: string;
}

interface UsuarioResumen {
  id: number;
  nombre: string;
}

// ======================================================
// FACTURAS DE INTERNET
// ======================================================
export interface FacturaInternet {
  id: number;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  pagada: boolean;
  estado: estadoFacturaInternet;
  periodo: string;
  pagos: Pagos[];
  creador: CreadorFactura;
  fechaPagada: string | Date;
  empresa: Empresa;
  cliente: ClienteDetailsDto;
  servicios: Servicio[]; // ← usa el primer Servicio declarado
  montoPago: number;
  detalleFactura: string;
  creadoEn: string;
  fechaPagoEsperada: string;
  saldoPendiente: number;
}

// ======================================================
// SERVICIO (Segunda definición! relacionada a Factura)
// ======================================================
export interface Servicio {
  facturaId: number;
  nombre: string;
  monto: number;
  pagado: number;
  fecha: string;
  estado: estadoFacturaInternet;
}

// ======================================================
// EMPRESA (Segunda definición completa)
// ======================================================
export interface Empresa {
  id: number;
  nombre: string;
  direccion: string;
  correo: string;
  pbx: string;
  sitioWeb: string;
  telefono: string;
  nit: string;
}

// ======================================================
// CREACIÓN FACTURA
// ======================================================
export interface CreadorFactura {
  id: number;
  nombre: string;
  rol: UsersRol;
}

// ======================================================
// ENUMS
// ======================================================
export enum UsersRol {
  TECNICO = "TECNICO",
  OFICINA = "OFICINA",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  COBRADOR = "COBRADOR",
}

export enum estadoFacturaInternet {
  PENDIENTE = "PENDIENTE",
  PAGADA = "PAGADA",
  VENCIDA = "VENCIDA",
  ANULADA = "ANULADA",
  PARCIAL = "PARCIAL",
}

// ======================================================
// PAGOS
// ======================================================
export interface Cobrador {
  id: number;
  nombreCobrador: string;
  rol: UsersRol;
}

export interface Pagos {
  id: number;
  fechaPago: string;
  metodoPago: string;
  montoPagado: number;
  cobrador: Cobrador;
}

// ======================================================
// CLIENTE-SERVICIO
// ======================================================
export interface ClienteServicio {
  id: number;
  servicio: Servicio;
  fechaContratacion: string;
}

// CAMPAING WHATSAPP HOOK & FILTERS
export interface CustomerCampaignWhatsapp {
  id: number;
  nombre: string;
  facturasPendientes: number;
  estado: EstadoCliente;
  estadoCobranza: EstadoCobranzaCliente;
  telefono: string;
  telefonoRef: string;
}

export interface CustomersCampaingQuery {
  zonaF?: number;
  sector?: number;
  municipio?: number;
  departamento?: number;
  nombre?: string;
  numeroFact?: number;
  estado?: EstadoCliente;
  estadoCobranza?: EstadoCobranzaCliente;
}

export type NormalizedCampaignCustomer = CustomerCampaignWhatsapp & {
  fullName: string;
  normalizedPhone: string;
  isValidPhone: boolean;
};
