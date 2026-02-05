import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { customerQkeys } from "../Client/Qk";

export interface UpdateCustomerIpAndNetworkDto {
  clienteId: number;
  direccionIp: string;
  gateway: string;
  mascara: string;
  userId: number;
  password: string;
}

/**
 * Actualizar la IP del cliente
 * @returns
 */
export function useUpdateNetworkCustomer() {
  const queryClient = useQueryClient();
  return useCrmMutation<any, UpdateCustomerIpAndNetworkDto>(
    "patch",
    "customer-network-config/update-ip-mk",
    undefined,
    {
      onSuccess: (_data, variables) => {
        const clienteId = variables.clienteId;
        queryClient.invalidateQueries({
          queryKey: customerQkeys.specificCustomer(clienteId),
        });
      },
    },
  );
}

export function useMakeAutorization(clienteId: number) {
  const queryClient = useQueryClient();

  return useCrmMutation<any, void>(
    "patch",
    `customer-network-config/authorize-installation/${clienteId}`,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: customerQkeys.specificCustomer(clienteId),
        });
      },
    },
  );
}
