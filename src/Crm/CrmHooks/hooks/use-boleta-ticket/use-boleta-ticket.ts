import { crm } from "@/Crm/API/crmApi";
import { boletaTicketQkeys } from "./Qk";
import { crm_endpoints } from "@/Crm/API/routes/endpoints";
import { BoletaSoporteDto } from "@/Crm/features/boleta-ticket/boleta-ticket";

export function useGetBoletaTicket(id: number) {
  return crm.useQueryApi<BoletaSoporteDto>(
    boletaTicketQkeys.specific(id),
    crm_endpoints.tickets_boleta.byId(id),
  );
}
