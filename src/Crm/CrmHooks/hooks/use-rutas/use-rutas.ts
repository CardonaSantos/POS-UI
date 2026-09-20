import { useQueryClient } from "@tanstack/react-query";

import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";

import type {
  RutaEditDetail,
  UpdateRutaPayload,
} from "@/Crm/features/rutas/ruta-edit.types";

import type { Ruta } from "@/Crm/features/rutas/rutas.interfaces";

import { type QueryRutasDto, rutasQkeys } from "./Qk";

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
  return useCrmQuery<PaginatedResponse<Ruta>, Error>(
    rutasQkeys.list(query),
    "/ruta-cobro/get-rutas-cobros",
    {
      params: query,
    },
  );
}

export function useGetRutaToEdit(rutaId: number) {
  return useCrmQuery<RutaEditDetail, Error>(
    rutasQkeys.specific(rutaId),
    `/ruta-cobro/get-one-ruta-to-edit/${rutaId}`,
    undefined,
    {
      enabled: Number.isInteger(rutaId) && rutaId > 0,

      retry: 1,
    },
  );
}

export function useUpdateRuta(rutaId: number) {
  const queryClient = useQueryClient();

  return useCrmMutation<unknown, UpdateRutaPayload, Error>(
    "patch",
    `/ruta-cobro/update-one-ruta/${rutaId}`,
    undefined,
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: rutasQkeys.specific(rutaId),
          }),

          queryClient.invalidateQueries({
            queryKey: rutasQkeys.all,
          }),
        ]);
      },
    },
  );
}

export function useCloseRuta(rutaId: number) {
  const queryClient = useQueryClient();

  return useCrmMutation<void, void>(
    "patch",
    `/ruta-cobro/close-one-ruta/${rutaId}`,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: rutasQkeys.all,
        });
      },
    },
  );
}

export function useDeleteRuta(rutaId: number) {
  const queryClient = useQueryClient();

  return useCrmMutation<void, void>(
    "delete",
    `/ruta-cobro/delete-one-ruta/${rutaId}`,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: rutasQkeys.all,
        });
      },
    },
  );
}
