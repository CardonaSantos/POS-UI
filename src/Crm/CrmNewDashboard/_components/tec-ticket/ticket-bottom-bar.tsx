import { TicketAsignadoTecnico } from "@/Crm/features/dashboard/dashboard-tickets";
import { getBlockedActionLabel } from "../ticket-helpers";
import { AppButton } from "@/components/app/primitives/app-button";
import { CheckCircle2, Send, Wrench } from "lucide-react";
import { TicketLifecycleAction } from "./ticket-details";

export function TicketBottomActionBar({
  ticket,
  lifecycleAction,
  isLoading,
  onRequestAction,
}: {
  ticket: TicketAsignadoTecnico;
  lifecycleAction: TicketLifecycleAction | null;
  isLoading: boolean;
  onRequestAction: () => void;
}) {
  const disabledLabel = getBlockedActionLabel(ticket.estado);

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-40",
        "border-t border-[hsl(var(--app-border,var(--border)))]",
        "bg-[hsl(var(--app-background,var(--background))/0.88)]",
        "px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2",
        "backdrop-blur-md",
        "md:sticky md:bottom-3 md:rounded-[var(--app-radius-lg)] md:border md:px-3 md:py-3",
      ].join(" ")}
    >
      {lifecycleAction ? (
        <AppButton
          type="button"
          size="lg"
          variant={lifecycleAction === "review" ? "secondary" : "primary"}
          width="full"
          loading={isLoading}
          loadingText="Procesando..."
          disabled={isLoading}
          leftIcon={
            lifecycleAction === "review" ? (
              <Send className="h-5 w-5" />
            ) : (
              <Wrench className="h-5 w-5" />
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
          size="lg"
          variant="secondary"
          width="full"
          disabled
          leftIcon={<CheckCircle2 className="h-5 w-5" />}
        >
          {disabledLabel}
        </AppButton>
      )}
    </div>
  );
}
