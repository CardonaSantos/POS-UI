export interface ClientesPaginatedResponse {
  data: ClienteWhatsappServerListItem[];
  meta: PaginationMeta;
}

export interface ClienteWhatsappServerListItem {
  id: number;
  empresaId: number;
  nombre: string | null;
  telefono: string;
  uuid: string | null;
  creadoEn: string; // ISO date string
}

export interface PaginationMeta {
  total: number;
  take: number;
  skip: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
