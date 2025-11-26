import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { facturaQkeys } from "../factura/Qk";

export function useDeletePagoFacturaPago(pagoId: number, facturaId: number) {
  const queryClient = useQueryClient();

  return useCrmMutation<void, number>(
    "delete",
    `facturacion/delete-one-payment/${pagoId}`,
    undefined,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: facturaQkeys.specific(facturaId),
        });
      },
    }
  );
}
