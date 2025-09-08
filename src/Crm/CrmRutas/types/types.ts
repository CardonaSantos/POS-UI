export interface CrearRutaDTO {
  nombreRuta: string;
  cobradorId: number;
  empresaId: number;
  clientes: number[];
  observaciones?: string;
}

export type SortField = "nombre" | "saldo";
export type SortDir = "asc" | "desc";
export const ITEMS_PER_PAGE = 10;
