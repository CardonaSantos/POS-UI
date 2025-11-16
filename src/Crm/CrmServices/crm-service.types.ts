// src/Crm/.../crm-service.types.ts

import currency from "currency.js";

/**
 * Estado del servicio en catálogo
 */
export type EstadoServicio = "ACTIVO" | "INACTIVO";

/**
 * Tipo de servicio (ej: Internet, TV, Soporte, etc.)
 */
export interface TipoServicio {
  id: number;
  nombre: string;
  descripcion: string;
  estado: EstadoServicio;
  creadoEn: string;
  actualizadoEn: string;
}

/**
 * Servicio tal como viene del backend para el listado
 */
export interface ServicioServiceManage {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: EstadoServicio;
  tipoServicioId: number;
  empresaId: number;
  clientesCount?: number;
}

/**
 * Shape para formularios de creación / edición de servicio
 */
export interface NuevoServicio {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: EstadoServicio;
  tipoServicioId: string | null; // compatible con <Select>
  empresaId: number;
}

/**
 * Shape para creación de tipo de servicio
 */
export interface NuevoTipoServicio {
  nombre: string;
  descripcion: string;
  estado: EstadoServicio;
}

/**
 * Helper para formatear moneda en Q
 */
export const formatearMoneda = (monto: number): string => {
  return currency(monto, {
    symbol: "Q",
    separator: ",",
    decimal: ".",
    precision: 2,
  }).format();
};
