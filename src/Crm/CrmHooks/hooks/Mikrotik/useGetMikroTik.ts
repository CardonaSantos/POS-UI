import { MikrotikRoutersResponse } from "@/Crm/features/mikro-tiks/mikrotiks.interfaces";
import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { mikroTikQkeys } from "./Qk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crmApi } from "@/hooks/axiosClient";

export function useGetMikroTiks() {
  return useCrmQuery<Array<MikrotikRoutersResponse>>(
    mikroTikQkeys.all,
    "/mikro-tik",
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60,
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

export function useCreateMikrotikRouter() {
  const queryClient = useQueryClient();
  return useCrmMutation("post", "mikro-tik", undefined, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mikroTikQkeys.all,
      });
    },
  });
}

export function useUpdateMikrotikRouter() {
  const queryClient = useQueryClient();
  return useCrmMutation("patch", "mikro-tik", undefined, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mikroTikQkeys.all,
      });
    },
  });
}

export type DeleteMikrotikRouterResponse = {
  id: number;
  eliminado: true;
};

export function useDeleteRouterMk() {
  const queryClient = useQueryClient();

  return useMutation<DeleteMikrotikRouterResponse, unknown, number>({
    mutationFn: async (routerId) => {
      if (!Number.isInteger(routerId) || routerId <= 0) {
        throw new Error(
          "No se recibió un identificador válido para eliminar el router.",
        );
      }

      const { data } = await crmApi.delete<DeleteMikrotikRouterResponse>(
        `/mikro-tik/${routerId}`,
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mikroTikQkeys.all,
      });
    },
  });
}
