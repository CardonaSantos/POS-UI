import { MetodoPagoFacturaInternet } from "@/Crm/features/factura-internet/factura-to-pay";
import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";
import { useQueryClient } from "@tanstack/react-query";
import { facturaQkeys } from "../factura/Qk";
interface createPagoDto {
  facturaInternetId: number;
  clienteId: number;
  montoPagado: number;
  metodoPago: MetodoPagoFacturaInternet;
  cobradorId: number;
  numeroBoleta: string;
  serviciosAdicionales: number[] | undefined;
  fechaPago: string | Date | null;
}
export function useCreateFactura(facturaId: number) {
  const queryClient = useQueryClient();
  return useCrmMutation<void, createPagoDto>(
    "post",
    `facturacion/create-new-payment`,
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
