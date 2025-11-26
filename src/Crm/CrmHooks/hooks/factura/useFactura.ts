import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { facturaQkeys } from "./Qk";
import { FacturaInternetToPay } from "@/Crm/features/factura-internet/factura-to-pay";

export function useGetFactura(facturaId: number) {
  return useCrmQuery<FacturaInternetToPay>(
    facturaQkeys.specific(facturaId),
    `facturacion/get-facturacion-with-payments/${facturaId}`
  );
}
