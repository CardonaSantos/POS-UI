import { EstadoCliente } from "../cliente-interfaces/cliente-types";

// Enums
export enum EstadoRuta {
  ACTIVO = "ACTIVO",
  EN_CURSO = "EN_CURSO",
  CERRADO = "CERRADO",
  ASIGNADA = "ASIGNADA",
  PENDIENTE = "PENDIENTE",

  COMPLETADO = "COMPLETADO",
  INACTIVO = "INACTIVO",
}

// Interfaces
interface Empresa {
  id: number;
  nombre: string;
}

interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
  direccion?: string;
}

interface Usuario {
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

export interface ClienteInternetFromRuta extends ClienteInternetFromCreateRuta {}

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
  facturasIds: string[];
  observaciones?: string;
  clientesIds: [];
}

export type PagedResponse<T> = { items: T[]; total: number };
