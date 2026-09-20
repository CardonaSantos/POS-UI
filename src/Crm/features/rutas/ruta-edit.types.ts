import type { EstadoCliente } from "../cliente-interfaces/cliente-types";
import { EstadoRuta } from "./rutas.interfaces";

export interface RutaEditEmpresa {
  id: number;
  nombre: string;
}

export interface RutaEditUbicacion {
  id: number;
  latitud: number;
  longitud: number;
}

export interface RutaEditCobrador {
  id: number;
  nombre: string;
  correo?: string;
  telefono?: string;
  rol?: string;
}

export interface RutaEditCliente {
  id: number;

  nombre: string;
  apellidos?: string;

  telefono?: string;
  direccion?: string;
  dpi?: string;

  estadoCliente: EstadoCliente;

  empresaId?: number;
  empresa?: RutaEditEmpresa;

  ubicacion?: RutaEditUbicacion;

  saldoPendiente: number;
  facturasPendientes: number;

  facturacionZona?: number;
}

export interface RutaEditDetail {
  id: number;

  nombreRuta: string;

  cobradorId?: number;
  cobrador?: RutaEditCobrador;

  empresaId: number;
  empresa: RutaEditEmpresa;

  clientes: RutaEditCliente[];

  cobrados: number;
  montoCobrado: number;

  estadoRuta: EstadoRuta;

  fechaCreacion: string;
  fechaActualizacion: string;

  observaciones?: string;
  diasCobro: string[];
}

export interface UpdateRutaPayload {
  nombreRuta: string;

  cobradorId?: number;

  empresaId: number;

  estadoRuta: EstadoRuta;

  observaciones?: string;

  clientes: number[];
}
