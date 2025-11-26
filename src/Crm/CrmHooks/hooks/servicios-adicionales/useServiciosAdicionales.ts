import { useCrmQuery } from "@/Crm/hooks/crmApiHooks";
import { serviciosAdicionalesQkeys } from "./Qk";
import { ServicioAdicional } from "@/Crm/features/servicio-adicional/servicio-adicional";

export function useGetServiciosAdicionales(customerId: number | undefined) {
  return useCrmQuery<Array<ServicioAdicional>>(
    serviciosAdicionalesQkeys.customer(customerId ?? 0),
    `servicio/get-servicios-to-invoice/${customerId}`,
    undefined,
    {
      enabled: !!customerId,
    }
  );
}
