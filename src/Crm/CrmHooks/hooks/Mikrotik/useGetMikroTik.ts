import type { MikrotikRoutersResponse } from "@/Crm/features/mikro-tiks/mikrotiks.interfaces";
import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { mikroTikQkeys } from "./Qk";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crmApi } from "@/hooks/axiosClient";

export interface UpdateMikrotikRouterPayload {
  nombre?: string;
  host?: string;
  sshPort?: number;
  usuario?: string;
  password?: string;
  descripcion?: string | null;
  activo?: boolean;
  oltId?: number | null;
}

export interface UpdateMikrotikRouterVariables {
  id: number;
  payload: UpdateMikrotikRouterPayload;
}

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

  return useMutation<
    MikrotikRoutersResponse,
    unknown,
    UpdateMikrotikRouterVariables
  >({
    mutationFn: async ({ id, payload }) => {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error(
          "No se recibió un identificador válido para actualizar el router.",
        );
      }

      const { data } = await crmApi.patch<MikrotikRoutersResponse>(
        `/mikro-tik/${id}`,
        payload,
      );

      return data;
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: mikroTikQkeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: [...mikroTikQkeys.all, variables.id],
      });
    },
  });
}

export type DeleteMikrotikRouterResponse = {
  id: number;
  eliminado: true;
};

export type ChangeMikrotikStatusResponse = {
  id: number;
  activo: boolean;
  nombre: string;
};

export function useDeactivateRouterMk() {
  const queryClient = useQueryClient();

  return useMutation<ChangeMikrotikStatusResponse, unknown, number>({
    mutationFn: async (routerId) => {
      const { data } = await crmApi.patch<ChangeMikrotikStatusResponse>(
        `/mikro-tik/${routerId}/desactivar`,
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

export function useReactivateRouterMk() {
  const queryClient = useQueryClient();

  return useMutation<ChangeMikrotikStatusResponse, unknown, number>({
    mutationFn: async (routerId) => {
      const { data } = await crmApi.patch<ChangeMikrotikStatusResponse>(
        `/mikro-tik/${routerId}/reactivar`,
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
