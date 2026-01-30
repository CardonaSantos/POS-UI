export enum TipoArchivoCliente {
  DPI = "DPI",
  CASA = "CASA",
  NEGOCIO = "NEGOCIO",
  RECIBO_LUZ = "RECIBO_LUZ",
  OTRO = "OTRO",
}

export const TipoArchivoClienteArray = Object.values(TipoArchivoCliente);

// Interfaces
export interface ReferenciaDto {
  uid: string;
  nombre: string;
  telefono: string;
  relacion: string;
}

export interface ArchivoItem {
  uid: string;
  file: File;
  tipo: TipoArchivoCliente;
  descripcion: string;
}

export interface InfoFinanciera {
  fuenteIngresos: string;
  tieneDeudas: boolean;
  detalleDeudas: string;
}

export interface ExpedienteFormData {
  infoFinanciera: InfoFinanciera;
  referencias: ReferenciaDto[];
  archivos: ArchivoItem[];
}

// Initial states
export const initialInfoFinanciera: InfoFinanciera = {
  fuenteIngresos: "",
  tieneDeudas: false,
  detalleDeudas: "",
};

export const createEmptyReferencia = (): ReferenciaDto => ({
  uid: crypto.randomUUID(),
  nombre: "",
  telefono: "",
  relacion: "",
});
