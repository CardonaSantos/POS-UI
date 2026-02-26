import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { QueryRutasDto, rutasQkeys } from "./Qk";
import { Ruta } from "@/Crm/features/rutas/rutas.interfaces";
import { useQueryClient } from "@tanstack/react-query";

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    pageSize: number;
  };
}

export function useGetRutas(query: QueryRutasDto) {
  return useCrmQuery<PaginatedResponse<Ruta>, void>(
    rutasQkeys.list(query),
    "ruta-cobro/get-rutas-cobros",
    {
      params: query,
    },
  );
}

export function useCloseRuta(rutaId: number) {
  const query = useQueryClient();
  return useCrmMutation<void, void>(
    "patch",
    `/ruta-cobro/close-one-ruta/${rutaId}`,
    undefined,
    {
      onSuccess: () => {
        query.invalidateQueries({
          queryKey: rutasQkeys.list(),
        });
      },
    },
  );
}

export function useDeleteRuta(rutaId: number) {
  const query = useQueryClient();
  return useCrmMutation<void, void>(
    "delete",
    `/ruta-cobro/delete-one-ruta/${rutaId}`,
    undefined,
    {
      onSuccess: () => {
        query.invalidateQueries({
          queryKey: rutasQkeys.list(),
        });
      },
    },
  );
}
