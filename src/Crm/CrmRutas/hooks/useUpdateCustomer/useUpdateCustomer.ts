// src/CrmRutas/hooks/Clientes/useUpdateCustomer.ts
import { useQueryClient } from "@tanstack/react-query";
import { customerQkeys } from "../Client/Qk";
import { UpdateCustomerDto } from "@/Crm/features/update-customer/update-customer";
import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";

export function useUpdateCustomer(customerId: number) {
  const queryClient = useQueryClient();
  return useCrmMutation<any, UpdateCustomerDto>(
    "patch",
    `internet-customer/update-customer/${customerId}`,
    undefined,
    {
      onSuccess: (_data, payload) => {
        // Refresca detalles del cliente
        queryClient.invalidateQueries({
          queryKey: customerQkeys.specificCustomer(payload.id),
        });
      },
    }
  );
}
