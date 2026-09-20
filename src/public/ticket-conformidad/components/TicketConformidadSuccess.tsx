import { CheckCircle2 } from "lucide-react";

import { AppCard } from "@/components/app/primitives/app-card";
import { AppStack } from "@/components/app/primitives/app-stack";

interface TicketConformidadSuccessProps {
  ticketId: number;
}

export function TicketConformidadSuccess({
  ticketId,
}: TicketConformidadSuccessProps) {
  return (
    <AppCard className="p-4">
      <AppStack gap="md" align="center">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 size={26} aria-hidden="true" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold">Respuesta registrada</h2>

          <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Su respuesta y firma fueron registradas correctamente para el ticket
            #{ticketId}.
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Gracias por su apoyo. Puede cerrar esta página.
        </p>
      </AppStack>
    </AppCard>
  );
}
