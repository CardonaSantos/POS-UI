import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";
import { customerQkeys } from "@/Crm/CrmRutas/hooks/Client/Qk";
import { useQueryClient } from "@tanstack/react-query";
import { clienteKeys } from "@/Crm/CrmCustomer/API/QK/queries-keys";

export function useDeleteImage(
  imageId: number,
  empresaId: number,
  customerId: number
) {
  const queryClient = useQueryClient();

  return useCrmMutation<void, void>(
    "delete",
    `media/${imageId}`,
    {
      params: {
        empresaId,
      },
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: customerQkeys.specificCustomer(customerId),
        });

        queryClient.invalidateQueries({
          queryKey: clienteKeys.details(customerId),
        });
        queryClient.invalidateQueries({
          queryKey: clienteKeys.media(customerId),
        });
      },
    }
  );
}
