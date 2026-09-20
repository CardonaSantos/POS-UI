import { CheckCircle2, CircleAlert } from "lucide-react";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppStack } from "@/components/app/primitives/app-stack";

interface TicketConformidadDecisionProps {
  disabled?: boolean;

  onConforme: () => void;

  onNoConforme: () => void;
}

export function TicketConformidadDecision({
  disabled = false,
  onConforme,
  onNoConforme,
}: TicketConformidadDecisionProps) {
  return (
    <AppCard className="p-2">
      <AppStack gap="md">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl text-center">
            ¿Está conforme con el trabajo realizado?
          </h2>
        </div>

        <AppStack gap="sm">
          <AppButton
            type="button"
            variant="success"
            size="lg"
            width="full"
            className="min-h-[60px] text-base sm:min-h-[64px]"
            leftIcon={<CheckCircle2 size={22} aria-hidden="true" />}
            disabled={disabled}
            onClick={onConforme}
          >
            Sí, estoy conforme
          </AppButton>

          <AppButton
            type="button"
            variant="danger"
            size="lg"
            width="full"
            className="min-h-[60px] text-base sm:min-h-[64px]"
            leftIcon={<CircleAlert size={22} aria-hidden="true" />}
            disabled={disabled}
            onClick={onNoConforme}
          >
            No estoy conforme
          </AppButton>
        </AppStack>
      </AppStack>
    </AppCard>
  );
}
