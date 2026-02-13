import { EstadoRuta } from "@/Crm/features/rutas/rutas.interfaces";

export interface QueryRutasDto {
  estado?: EstadoRuta | null;
  page?: number;
  limit?: number;
  cobrador?: number;
  nombreRuta?: string;
}

export const rutasQkeys = {
  all: ["rutas"] as const,
  specific: (id: number) => ["rutas", id] as const,
  list: (query?: QueryRutasDto) => ["rutas", query] as const,
};
