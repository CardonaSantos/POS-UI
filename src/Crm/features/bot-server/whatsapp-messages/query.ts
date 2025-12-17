export interface FindClientesQuery {
  id?: number;
  nombre?: string;
  telefono?: string;
  uuid?: string;
  crmUsuarioId?: number;
  creadoEn?: string; // ISO string: "2025-12-16T00:00:00.000Z" o "2025-12-16"
  actualizadoEn?: string; // ISO string
  take?: number;
  skip?: number;
}

export interface PaginatedMeta {
  total: number;
  take: number;
  skip: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}
