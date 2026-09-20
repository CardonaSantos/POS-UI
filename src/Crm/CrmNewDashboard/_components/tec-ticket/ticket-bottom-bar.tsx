import type { TicketAsignadoTecnico } from "@/Crm/features/dashboard/dashboard-tickets";

import { getBlockedActionLabel } from "../ticket-helpers";

import { AppButton } from "@/components/app/primitives/app-button";

import { CheckCircle2, PenLine, Send, Wrench } from "lucide-react";

import type { TicketLifecycleAction } from "./ticket-details";

import { useNavigate } from "react-router-dom";

interface TicketBottomActionBarProps {
  ticket: TicketAsignadoTecnico;

  lifecycleAction: TicketLifecycleAction | null;

  isLoading: boolean;

  conformidadLoading?: boolean;

  onRequestAction: () => void;

  onRequestConformidad: () => void;
}

export function TicketBottomActionBar({
  ticket,
  lifecycleAction,
  isLoading,
  conformidadLoading = false,
  onRequestAction,
  onRequestConformidad,
}: TicketBottomActionBarProps) {
  const navigate = useNavigate();

  const disabledLabel = getBlockedActionLabel(ticket.estado);

  const handleFirmaTecnico = () => {
    navigate(`/crm/ticket-detalles/${ticket.id}/firma-tecnico`);
  };

  return (
    <div
      className={[
        /*
         * Sticky mantiene la barra visible,
         * pero NO la saca del flujo como fixed.
         * Así no tapa el contenido.
         */
        "sticky bottom-2 z-30",

        "mt-4",
        "rounded-[var(--app-radius-lg)]",
        "border border-[hsl(var(--app-border,var(--border)))]",

        "bg-[hsl(var(--app-background,var(--background))/0.94)]",
        "p-2",

        "shadow-sm",
        "backdrop-blur-md",
      ].join(" ")}
    >
      {/*
       * Acciones auxiliares:
       * Firma + enlace lado a lado.
       */}
      <div className="grid grid-cols-2 gap-2">
        <AppButton
          type="button"
          size="md"
          variant="secondary"
          width="full"
          leftIcon={<PenLine className="h-4 w-4" aria-hidden="true" />}
          onClick={handleFirmaTecnico}
        >
          Firmar
        </AppButton>

        <AppButton
          type="button"
          size="md"
          variant="secondary"
          width="full"
          loading={conformidadLoading}
          loadingText="Generando..."
          disabled={conformidadLoading}
          leftIcon={<PenLine className="h-4 w-4" aria-hidden="true" />}
          onClick={onRequestConformidad}
        >
          Firma cliente
        </AppButton>
      </div>

      {/*
       * Acción principal del lifecycle.
       *
       * Separada visualmente de las
       * acciones auxiliares.
       */}
      <div className="mt-2">
        {lifecycleAction ? (
          <AppButton
            type="button"
            size="md"
            variant={lifecycleAction === "review" ? "secondary" : "primary"}
            width="full"
            loading={isLoading}
            loadingText="Procesando..."
            disabled={isLoading}
            leftIcon={
              lifecycleAction === "review" ? (
                <Send className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Wrench className="h-4 w-4" aria-hidden="true" />
              )
            }
            onClick={onRequestAction}
          >
            {lifecycleAction === "review"
              ? "Enviar a revisión"
              : "Tomar ticket en proceso"}
          </AppButton>
        ) : (
          <AppButton
            type="button"
            size="md"
            variant="outline"
            width="full"
            disabled
            leftIcon={<CheckCircle2 className="h-4 w-4" aria-hidden="true" />}
          >
            {disabledLabel}
          </AppButton>
        )}
      </div>
    </div>
  );
}
