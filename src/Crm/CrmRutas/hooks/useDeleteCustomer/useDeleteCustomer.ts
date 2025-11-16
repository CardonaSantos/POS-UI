// src/CrmRutas/hooks/Clientes/useUpdateCustomer.ts
import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";

export function useDeleteCustomer(customerId: number) {
  return useCrmMutation<void, void>(
    "delete",
    `internet-customer/delete-one-customer/${customerId}`,
    undefined
  );
}
