import { useQueryClient } from "@tanstack/react-query";

import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";
import { customerQkeys } from "@/Crm/CrmHooks/hooks/Client/Qk";
import { clienteKeys } from "@/Crm/CrmCustomer/API/QK/queries-keys";

interface DeleteMediaPayload {
  id: number;
}

export function useDeleteImage(empresaId: number, customerId: number) {
  const queryClient = useQueryClient();

  return useCrmMutation<unknown, DeleteMediaPayload>(
    "post",
    "media/delete",
    {
      params: {
        empresaId,
      },
    },
    {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: customerQkeys.specificCustomer(customerId),
          }),

          queryClient.invalidateQueries({
            queryKey: clienteKeys.details(customerId),
          }),

          queryClient.invalidateQueries({
            queryKey: clienteKeys.media(customerId),
          }),
        ]);
      },
    },
  );
}
