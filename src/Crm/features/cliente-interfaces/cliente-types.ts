// ======================================================
// ROOT: ClienteDetailsDto
import { CustomerImage } from "../customer-galery/customer-galery.interfaces";
import { Departamentos } from "../locations-interfaces/municipios_departamentos.interfaces";
export interface ClienteDetailsDto {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: string;
  direccion: string;
  dpi: string;
  observaciones: string;
  contactoReferenciaNombre: string;
  contactoReferenciaTelefono: string;
  estadoCliente: string;
  contrasenaWifi: string;
  ssidRouter: string;
  fechaInstalacion: string; // ISO string
  asesor: Asesor | null;
  servicio: Servicio | null; // Relación 1:1
  municipio: Municipio;
  sector: Sector;
  departamento: Departamentos;
  empresa: Empresa;
  IP: IP;
  ubicacion: Ubicacion;
  saldoCliente: SaldoCliente | null;
  creadoEn: string;
  actualizadoEn: string;
  ticketSoporte: TicketSoporte[];
  facturaInternet: FacturaInternet[];
  clienteServicio: ClienteServicio[];
  contratoServicioInternet: ContratoServicioInternet | null;
  imagenes: CustomerImage[];
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
  descripcion: string;
  estado: string;
  prioridad: string;
  fechaCreacion: string;
  fechaCierre: string | null;
  creadoPor: {
    id: number;
    nombre: string;
  };
  tecnico: {
    id: number;
    nombre: string;
  };
  acompanantes: acompanantes[];
}

interface acompanantes {
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
