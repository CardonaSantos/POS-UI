import { TipoArchivoCliente } from "../credito/credito-interfaces";

export interface ClienteArchivoDto {
  id: number;
  expedienteId: number;
  tipo: TipoArchivoCliente;
  url: string;
  descripcion?: string | null;
  creadoEn: string; // ISO string
  actualizadoEn: string; // ISO string
}
export interface ClienteExpedienteDto {
  id: number;
  clienteId: number;

  fuenteIngresos?: string | null;
  tieneDeudas?: boolean | null;
  detalleDeudas?: string | null;

  creadoEn: string;
  actualizadoEn: string;

  archivos: ClienteArchivoDto[];
  referencias: ClienteReferenciaDto[];
}

export interface ClienteReferenciaDto {
  id: number;
  expedienteId: number;
  nombre: string;
  telefono: string;
  relacion: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ClienteExpedienteDto {
  id: number;
  clienteId: number;

  fuenteIngresos?: string | null;
  tieneDeudas?: boolean | null;
  detalleDeudas?: string | null;

  creadoEn: string;
  actualizadoEn: string;

  archivos: ClienteArchivoDto[];
  referencias: ClienteReferenciaDto[];
}
