import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { facturaQkeys } from "../factura/Qk";

export function useDeletePagoFactura(facturaId: number) {
  const queryClient = useQueryClient();
  return useCrmMutation("delete", `facturacion/delete-one-factura`, undefined, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: facturaQkeys.specific(facturaId),
      });
    },
  });
}
