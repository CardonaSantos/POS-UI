import { useCrmMutation, useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { PlantillasInterface } from "@/Crm/features/plantilla-contratos/plantilla-contratos";
import { ClienteDetailsDto } from "@/Crm/features/cliente-interfaces/cliente-types";
import { clienteKeys } from "./QK/queries-keys";
import { useQueryClient } from "@tanstack/react-query";
import { customerQkeys } from "@/Crm/CrmHooks/hooks/Client/Qk";
// Cliente
export function useClienteDetails(clienteId: number) {
  return useCrmQuery<ClienteDetailsDto>(
    clienteKeys.details(clienteId),
    `/internet-customer/get-customer-details/${clienteId}`,
    undefined,
    {
      enabled: !!clienteId,
      staleTime: 0,
      gcTime: 1000 * 60, // opcional, 1 minuto de cache en memoria
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

// Plantillas de contrato
export function usePlantillasContrato() {
  return useCrmQuery<PlantillasInterface[]>(
    clienteKeys.plantillasContrato,
    "/contrato-cliente/plantillas-contrato",
    undefined,
    {
      staleTime: 0,
      gcTime: 1000 * 60, // opcional, 1 minuto de cache en memoria
      refetchOnWindowFocus: "always",
      refetchOnMount: "always",
      refetchOnReconnect: "always",
      retry: 1,
    },
  );
}

//mutacion para cargar media ------>
export function useUploadMediaBatch(clienteId: number) {
  const queryClient = useQueryClient();

  return useCrmMutation<any, FormData>("post", "/media/batch", undefined, {
    onSuccess: () => {
      // invalidamos datos de ese cliente
      if (clienteId) {
        queryClient.invalidateQueries({
          queryKey: clienteKeys.details(clienteId),
        });
        queryClient.invalidateQueries({
          queryKey: clienteKeys.media(clienteId),
        });
        queryClient.invalidateQueries({
          queryKey: customerQkeys.specificCustomer(clienteId),
        });
      }
    },
  });
}
