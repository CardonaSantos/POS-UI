import { MikrotikRoutersResponse } from "@/Crm/features/mikro-tiks/mikrotiks.interfaces";
import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { mikroTikQkeys } from "./Qk";
import { useQueryClient } from "@tanstack/react-query";

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
    }
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

export function useDeleteRouterMk(id: number) {
  const queryClient = useQueryClient();
  return useCrmMutation<void, void>("delete", `mikro-tik/${id}`, undefined, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: mikroTikQkeys.all,
      });
    },
  });
}
