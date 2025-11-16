import { EstadoCliente } from "../features/cliente-interfaces/cliente-types";

// Enums
export enum EstadoRuta {
  ACTIVO = "ACTIVO",
  INACTIVO = "INACTIVO",
  COMPLETADO = "COMPLETADO",
  PENDIENTE = "PENDIENTE",
  CERRADO = "CERRADO",
}

// Interfaces
export interface Empresa {
  id: number;
  nombre: string;
}

export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
  direccion?: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellidos?: string;
  email: string;
  telefono?: string;
  rol: string;
}

export interface ClienteInternetFromCreateRuta {
  id: number;
  nombre: string;
  apellidos?: string;
  telefono?: string;
  telefonoReferencia?: string;
  direccion?: string;
  dpi?: string;
  estadoCliente: EstadoCliente;
  empresaId?: number;
  empresa?: Empresa;
  ubicacion?: Ubicacion;
  saldoPendiente?: number;
  facturasPendientes?: number;
  facturacionZona: number;
  zonaFacturacion: string;

  municipio: Municipio;
  sector: SectorCliente;
  facturas?: { id: number; montoFactura: number; fechaPagoEsperada: string }[]; // 👈
}

export interface ClienteInternetFromRuta
  extends ClienteInternetFromCreateRuta {}

interface Municipio {
  id: number;
  nombre: string;
}

interface SectorCliente {
  id: number;
  nombre: string;
}

export interface Ruta {
  id: number;
  nombreRuta: string;
  cobradorId?: number;
  cobrador?: Usuario;
  empresaId: number;
  empresa: Empresa;
  clientes: ClienteInternetFromCreateRuta[];
  cobrados: number;
  estadoRuta: EstadoRuta;
  fechaCreacion: string;
  fechaActualizacion: string;
  observaciones?: string;
  diasCobro?: string[];
  //

  totalACobrar: number;
  totalCobrado: number;
}

export interface CreateRutaDto {
  nombreRuta: string;
  cobradorId?: string | null;
  EmpresaId: number;
  facturasIds: string[]; // 👈 ahora mandamos facturas, no clientes
  observaciones?: string;
  clientesIds: [];
}

export type PagedResponse<T> = { items: T[]; total: number };
