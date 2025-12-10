import { suspendCustomerDto } from "@/Crm/features/mikrotik-actions-interfaces/mikrotik-actions.dto";
import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { customerQkeys } from "../Client/Qk";
import { clienteKeys } from "@/Crm/CrmCustomer/API/QK/queries-keys";

export function useMikrotikSuspend(customerId: number) {
  const queryClient = useQueryClient();
  return useCrmMutation<void, suspendCustomerDto>(
    "post",
    "ssh-mikrotik-connection/suspend-customer",
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: customerQkeys.specificCustomer(customerId),
        });
        queryClient.invalidateQueries({
          queryKey: clienteKeys.details(customerId),
        });
      },
    }
  );
}

export function useMikrotikActivar(customerId: number) {
  const queryClient = useQueryClient();
  return useCrmMutation<void, suspendCustomerDto>(
    "post",
    "ssh-mikrotik-connection/activate-customer",
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: customerQkeys.specificCustomer(customerId),
        });

        queryClient.invalidateQueries({
          queryKey: clienteKeys.details(customerId),
        });
      },
    }
  );
}
