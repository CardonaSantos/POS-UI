import { useCrmMutation } from "@/Crm/hooks/crmApiHooks";


export interface CreateTicketResumenPayload {
  ticketId: number;
  solucionId?: number | null;      // Puede ser null si se limpia el select
  resueltoComo?: string | null;    // Max 500
  notasInternas?: string | null;   // Max 1000
  reabierto?: boolean;             // Default false
  numeroReaperturas?: number;      // Min 0
  intentos?: number;               // Min 1
  tiempoTotalMinutos?: number | null;
  tiempoTecnicoMinutos?: number | null;
}

export function useCreateTicketResumen() {
    return useCrmMutation<void, CreateTicketResumenPayload>(
      "patch",
      `tickets-soporte/close-ticket-soporte`,
      undefined,
    )
}