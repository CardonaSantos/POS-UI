export type TipoMedia = "IMAGEN" | "VIDEO"; // o importar del backend si lo tienes

export interface SubirMediaBatchInput {
  empresaId: number;
  clienteId?: number;
  albumId?: number;
  subidoPorId?: number;
  publico?: boolean;
  categoria: string;
  tipo?: TipoMedia;
  basePrefix?: string;
  items: MediaUploadItem[]; // 👈 array de objetos completos
}

export interface SubirMediaBatchPayload {
  empresaId: number;
  clienteId: number;
  albumId?: number;
  subidoPorId?: number;
  publico?: boolean;
  categoria: string;
  tipo?: TipoMedia; // opcional (el backend puede inferir por mimetype)
  basePrefix?: string;
  items: MediaUploadItem[]; // 1 a 1 con "files" que mandamos
}

export interface MediaUploadItem {
  file: File; // archivo final (cropeado o original)
  titulo?: string;
  descripcion?: string;
  etiqueta?: string;
  custom_Id: string;
}
